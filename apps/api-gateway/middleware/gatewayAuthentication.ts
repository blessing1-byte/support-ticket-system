//strip identity headers
//set gateway secret header
//confirm the path to know if the route is public or private
//if public then end process
//if private, verify token against the header: authorization
// from the returned result, take the role from the token and check the allowed roles
//if role is right, attach the user headers, userId and role.
