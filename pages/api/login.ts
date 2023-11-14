import { COOKIE_NAME, COOKIE_PASSWORD } from 'constants/ironSession';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const token = req.query.token;

    (req.session as any).user = {
      token,
    };
    await req.session.save();
    res.send({ message: 'Session saved on server', success: true, token });
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
