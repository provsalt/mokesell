export async function GET() {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": `token=; path=/; HttpOnly; SameSite=Strict; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
}
