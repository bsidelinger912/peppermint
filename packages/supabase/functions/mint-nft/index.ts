// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import NFTContract from "./NFT.json" assert { type: "json" };

interface ReqPayload {
  redemption_code: string;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const devPublicKey = "0xB5D877f02af0eAEbe909A2F06752a1C4b043C5f2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { redemption_code }: ReqPayload = await req.json();

  // Validate required fields
  if (!redemption_code) {
    return new Response(
      JSON.stringify({
        error: "Missing required field: redemption_code is required",
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400,
      },
    );
  }

  // Get user_id from auth headers
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({
        error: "Missing authorization header",
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401,
      },
    );
  }

  // Extract user_id from JWT token
  const token = authHeader.replace("Bearer ", "");
  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("***** jwt payload", JSON.stringify(payload, null, 2));
  const user_id = payload.sub;
  console.log("****** user id", user_id);

  try {
    // Get environment secrets
    const devPrivateKey = Deno.env.get("DEV_PRIVATE_KEY");
    const rpcUrl = Deno.env.get("RPC_URL");

    if (!devPrivateKey || !rpcUrl) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required environment variables: DEV_PRIVATE_KEY and RPC_URL",
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 500,
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

    // Get user's blockchain address from the blockchain_address table
    const { data: addressData, error: addressError } = await supabase
      .from("blockchain_address")
      .select("public_key")
      .eq("user_id", user_id)
      .single();

    if (addressError || !addressData) {
      return new Response(
        JSON.stringify({
          error: "No blockchain address found for this user",
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 404,
        },
      );
    }

    const user_address = addressData.public_key;

    // Look up the redemption code in the database
    const { data, error } = await supabase
      .from("redemption_code")
      .select("*, album(*)")
      .eq("id", redemption_code)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid redemption code",
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 404,
        },
      );
    }

    // Check if the redemption code is already used
    if (data.redeemed_by) {
      return new Response(
        JSON.stringify({
          error: "Redemption code has already been used",
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 409,
        },
      );
    }

    console.log("****data", data);

    // TODO: Add your NFT minting logic here
    // This could involve:
    // 1. Calling an NFT minting service/API
    // 2. Updating the redemption code to mark it as used
    // 3. Recording the minting transaction

    const provider = new JsonRpcProvider(rpcUrl);
    const signer = new Wallet(devPrivateKey, provider);

    const album = data.album;
    const nftContract = new Contract(
      album.contract as string,
      NFTContract.abi,
      provider,
    );

    console.log(`sending transaction to: ${album.contract}, via ${rpcUrl}`);

    const transaction = await signer.sendTransaction({
      from: devPublicKey,
      to: album.contract,
      data: nftContract.interface.encodeFunctionData("mintNFT", [user_address]),
    });

    const result = await transaction.wait();

    console.log(`transaction complete, result: ${result}`);

    // Mark the redemption code as redeemed by the user
    const { error: updateError } = await supabase
      .from("redemption_code")
      .update({
        redeemed_by: user_id,
        // TODO: could be good to add redeemed_at: new Date().toISOString(),
      })
      .eq("id", redemption_code);

    if (updateError) {
      console.error("Failed to update redemption code status:", updateError);
      // Note: We don't fail the request here since the NFT was already minted
      // but we should log the error for debugging
    }

    // Return the validated data
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          transactionHash: result.transactionHash,
          message: "NFT minted successfully",
        },
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err?.message ?? "Internal server error",
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/mint-nft' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"redemption_code":"ABC123","user_address":"0x1234567890abcdef"}'

*/
