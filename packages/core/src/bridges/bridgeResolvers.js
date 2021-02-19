import { registerBridge, bridges } from '.'

const bridgeResolvers = {
  getBridgesQueryResolver: () => bridges,

  updateBridgeMutationResolver: (parent, args, context, info) => {
    var clientIP = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress
    if (clientIP.substr(0, 7) === '::ffff:') {
      clientIP = clientIP.substr(7)
    }
    return registerBridge({ ...args.bridge, address: clientIP })
  }
}

export { bridgeResolvers }
