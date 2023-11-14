import { COOKIE_NAME, COOKIE_PASSWORD } from 'constants/ironSession';
import { withIronSessionSsr } from 'iron-session/next';

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, res }) {
    const user = req.session.user;

    if (!user?.token) {
      res.writeHead(301, { Location: '/login' });
      res.end();
    }
    // console.log(user);

    return {
      props: {
        user: 'hehe',
      },
    };
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
