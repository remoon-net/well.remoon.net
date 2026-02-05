const { connect } = await import("https://unpkg.com/well-net/index.js")
const net = await connect({
  Key: "IDHBZNpXkYmavc3JhCvCA9bTh6fo2IfB1D/F6mE6xXg=",
  Peer: "https://2ytm7ogz2.neiwangyun.net/#NQgbRewmcsigWOwyRURJuLbS/ytf8VJtWCCjBQLkrUQ=",
})

const req = new Request("http://[2001:f4::192.168.211.2]")
net
  .fetch(req)
  .then(async (v) => {
    let b = await v.text()
    console.log("vvvvvvvvvvvvvvvvvv", b)
  })
  .catch((err) => {
    console.error("eeeeeeeeeeeeeeeeeee", err)
  })

const srv = await net.listen("[::]:80", {
  fetch(req) {
    return new Response("ok")
  },
})

await net.http_proxy("0.0.0.0:1080", {})
await net.socks5_proxy("0.0.0.0:1089", {}).catch((err) => {
  console.error(err)
})
