// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type SubgraphWebhookRequestData = {
  block_timestamp: string;
  token_uri: string;
  token_id: string;
  owner: string;
  contract_address: string;
};

type Trait = {
  trait_type: string;
  value: string;
};

type NFTMetaData = {
  attributes: Trait[];
  image: string;
  artist: string;
  title: string;
  description: string;
  audio?: string;
  songId?: string;
  albumId?: string;
};

function extractMetaData(tokenURI: string): NFTMetaData {
  const encoded = tokenURI.split(";base64,")[1];

  try {
    const json = atob(encoded);
    return JSON.parse(json) as NFTMetaData;
  } catch (e) {
    console.error("Failed to parse metadata");
    throw new Error("Failed to parse metadata");
  }
}

function normalizeAddress(address: string) {
  const body = address.split("\\x")[1];
  return `0x${body}`;
}

type SubgraphWebhookRequest = {
  op: string; // "INSERT" for example
  data_source: string; // "name/version" of subgraph
  entity: string; // "token"
  data: {
    old: SubgraphWebhookRequestData | null;
    new: SubgraphWebhookRequestData;
  };
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Validate webhook secret
  const webhookSecret = req.headers.get("goldsky-webhook-secret");
  const expectedSecret = Deno.env.get("GOLDSKY_WEBHOOK_SECRET");

  if (!webhookSecret || !expectedSecret || webhookSecret !== expectedSecret) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid webhook secret",
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401,
      },
    );
  }

  try {
    const webhookData: SubgraphWebhookRequest = await req.json();

    console.log(
      "****** have webhook data",
      JSON.stringify(webhookData, null, 2),
    );

    // Validate the webhook data
    if (!webhookData.data?.new) {
      console.error("Missing required 'data.new' property in webhook request");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required 'data.new' property in webhook request",
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        },
      );
    }

    const { new: tokenData } = webhookData.data;

    // Validate required fields
    if (
      !tokenData.token_id || !tokenData.contract_address || !tokenData.owner
    ) {
      console.error(
        "Missing required fields: token_id, contract_address, or owner",
      );
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Missing required fields: token_id, contract_address, or owner",
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: `Bearer ${
              Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
            }`,
          },
        },
      },
    );

    // Extract album_id from token_uri metadata
    let albumId: number;
    try {
      const metadata = extractMetaData(tokenData.token_uri);
      if (!metadata.albumId) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "No albumId found in token metadata",
          }),
          {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 400,
          },
        );
      }

      // shim for old NFT contract that used firebase album_id
      if (metadata.albumId === "OabaUcEPAOr1vYFFpzF4") {
        albumId = 1;
      } else {
        albumId = parseInt(metadata.albumId);
      }

      if (isNaN(albumId)) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Invalid albumId in token metadata",
          }),
          {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 400,
          },
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Failed to extract album_id from token_uri: ${
            error instanceof Error ? error.message : String(error)
          }`,
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        },
      );
    }

    console.log("raw token owner: ", tokenData.owner);

    // Normalize address format (convert \\\\x to 0x)
    const normalizedOwner = normalizeAddress(tokenData.owner);
    const normalizedContractAddress = normalizeAddress(
      tokenData.contract_address,
    );

    console.log("After replacement - owner:", normalizedOwner);
    console.log("After replacement - contract:", normalizedContractAddress);

    // Look up user_id from blockchain_address table using owner address (case-insensitive)
    const { data: blockchainAddress, error: addressError } = await supabase
      .from("blockchain_address")
      .select("user_id")
      .ilike("public_key", normalizedOwner)
      .single();

    if (addressError) {
      console.log("404: Database query error for address lookup", {
        normalizedOwner,
        addressError: addressError.message,
      });
      return new Response(
        JSON.stringify({
          success: false,
          message:
            `Failed to find user for wallet address ${normalizedOwner}: ${addressError.message}`,
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 404,
        },
      );
    }

    if (!blockchainAddress?.user_id) {
      console.log("404: No user found in blockchain_address table", {
        normalizedOwner,
        blockchainAddress,
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: `No user found for wallet address ${normalizedOwner}`,
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 404,
        },
      );
    }

    const userId = blockchainAddress.user_id;

    // Insert the token data into the "token" table
    const { data, error } = await supabase
      .from("token")
      .insert({
        album_id: albumId,
        user_id: userId,
        contract_address: normalizedContractAddress,
        token_id: tokenData.token_id,
      })
      .select()
      .single();

    if (error) {
      console.error(`Failed to insert token: ${error.message}`);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Failed to insert token: ${error.message}`,
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        message:
          `Token ${tokenData.token_id} from contract ${normalizedContractAddress} processed successfully`,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      },
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error(errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'https://vrkpvsbchkrpcggxknnj.supabase.co/functions/v1/subgraph-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6InhJdm00OGY4eFg3RFZMdjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Zya3B2c2JjaGtycGNnZ3hrbm5qLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJjMDQ1NjRmOC0xZDQ3LTRmZmMtYmVhNy02ZTFjNTRhNjZlODMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUzMzMwMDk1LCJpYXQiOjE3NTMzMjY0OTUsImVtYWlsIjoiYmVuLnNpZGVsaW5nZXJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCIsImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTFVuekVfRndMZUt2b3REU0ViZzZxVmdMNFh5ek9SZDU3Vk9QbFVydWZZdG5FR0JiZmw9czk2LWMiLCJlbWFpbCI6ImJlbi5zaWRlbGluZ2VyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJCZW4gU2lkZWxpbmdlciIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJCZW4gU2lkZWxpbmdlciIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xVbnpFX0Z3TGVLdm90RFNFYmc2cVZnTDRYeXpPUmQ1N1ZPUGxVcnVmWXRuRUdCYmZsPXM5Ni1jIiwicHJvdmlkZXJfaWQiOiIxMDY3ODQxMTYwMzM1MTA0NTk4MDUiLCJzdWIiOiIxMDY3ODQxMTYwMzM1MTA0NTk4MDUifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvYXV0aCIsInRpbWVzdGFtcCI6MTc1MzI5NTI1M31dLCJzZXNzaW9uX2lkIjoiNzZmYjA5ODgtODNkMy00ZmJjLTg1NDYtZTE1ZWNlYzY2MDg3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.eQQs_sMWMlSdZ3vukGaLc7HGpHCfBLqO4XKGlyalHN4' \
    --header 'goldsky-webhook-secret: whs_01HTD7VPVQ6VTSVZHEGMFC6V14' \
    --header 'Content-Type: application/json' \
    --data '{ "op": "INSERT", "data_source": "my-subgraph/v1.0.0", "entity": "token", "data": { "old": null, "new": { "block_timestamp": "2024-01-01T00:00:00Z",  "token_uri": "data:application/json;base64,eyJhcnRpc3QiOiJCZW5ueSBTaWRlbGluZ2VyIiwidGl0bGUiOiJDaGVycnkgU3RyZWV0IiwiZGVzY3JpcHRpb24iOiJNeSBmaXJzdCBzb2xvIGFsYnVtLCBjby1wcm9kdWNlZCB3aXRoIE1pY2FlbCBDb25ub2xseSIsImltYWdlIjoiaHR0cHM6Ly9kMWtjN2VjbTNndWUzcy5jbG91ZGZyb250Lm5ldC9jaGVycnlfc3RyZWV0X2ltYWdlcy9jaGVycnlfc3RyZWV0X2NvdmVyXzUwMC5wbmciLCJhbGJ1bUlkIjoiT2FiYVVjRVBBT3IxdllGRnB6RjQiLCJhdHRyaWJ1dGVzIjpbXX0=", "token_id": "1", "owner": "0xB5D877f02af0eAEbe909A2F06752a1C4b043C5f2", "contract_address": "0xc5fc2f0bcf9fb2dcfd4e31e31833466221e65ec5" } } }'

*/
