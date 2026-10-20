//strip identity headers
//set gateway secret header
//confirm the path to know if the route is public or private
//if public then end process
//if private, verify token against the header: authorization
// from the returned result, take the role from the token and check the allowed roles
//if role is right, attach the user headers, userId and role.

//api gateway is the first thing that runs, then runs the middleware to authenticate the user, the middleware does the job of adding the gateway secret from the env into the header, that hold it first, then when its about to enter into the protected route, it now runs the function of verifyGatewaySecret, so it checks the gateway secret that was added by the middleware, ie. incomingSecret against the expectedSecret in the .env
