import { COOKIE_NAME, COOKIE_PASSWORD } from 'constants/ironSession';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    res.send({ user: (req.session as any).user });
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
