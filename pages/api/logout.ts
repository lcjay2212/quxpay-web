import { COOKIE_NAME, COOKIE_PASSWORD } from 'constants/ironSession';
import { withIronSessionApiRoute } from 'iron-session/next';
export default withIronSessionApiRoute(
  function logoutRoute(req, res) {
    req.session.destroy();
    res.send({ success: true, message: 'Session cleared' });
  },
  {
    cookieName: COOKIE_NAME,
    password: COOKIE_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);
