import { Box, BoxProps, Button, Container, Flex, Grid, Heading, Text, useBreakpoint } from '@chakra-ui/react';
import { Footer, SEO, TopBarHeader } from 'component';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as forge from 'node-forge';
import { PhoneImage, QrCodeImage } from 'public/assets';
import { FC } from 'react';
import { useHomePageModal } from 'store';

export const Content: FC<
  BoxProps & {
    label: string;
    content: string;
    alignItems?: string;
    showBtn?: boolean;
    onClick?: () => void;
  }
> = ({ label, content, alignItems = 'center', showBtn = true, onClick, ...props }) => {
  return (
    <Container maxW="1080px">
      <Flex
        h={{ base: 'auto', md: '100vh' }}
        justifyContent={{ base: 'center', md: 'flex-start' }}
        alignItems={alignItems}
        pt={{ base: '5rem', md: 0 }}
        pb={{ base: '1rem', md: 0 }}
      >
        <Box
          w={{ base: 'auto', md: 400, lg: 560 }}
          color="white"
          textAlign={{ base: 'center', md: 'start' }}
          {...props}
        >
          <Heading fontSize={{ base: '2.5rem', md: '60px' }} fontWeight="extrabold" fontFamily="Coda, sans-serif">
            {label}
          </Heading>
          <Text fontSize={{ base: '1.25rem', lg: '30px' }} my="1.5rem" fontFamily="'Verdana', sans-serif">
            {content}
          </Text>
          {showBtn && (
            <Button variant="seeMore" onClick={onClick}>
              See more
            </Button>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

const Home: FC = () => {
  const router = useRouter();
  const visible = useHomePageModal(({ visible }) => visible);
  const breakPoint = useBreakpoint();

  // RSA private key (PEM format)
  const privateKeyPEM = `-----BEGIN PRIVATE KEY-----
MIIJQQIBADANBgkqhkiG9w0BAQEFAASCCSswggknAgEAAoICAQDKT1GfeFd0iyj5
hgprOJGPVBCslmMGWPmuUL2uyHgGZ302Oa5FcOqzYjArvGuQ/FTqCU6lfqx1c/8h
VL2nAQa5IQfmnsKBxIW/qfDhq6qmfnMnGAwFNKXiAfoNJGKMNWol1gaEPr3fyzYz
gtHv3pjl3JjX4b66ezC3MiML2eUBTpS+EBUXvpm4vUZyBkf/VBgn08IpA3y/CZ5s
YCCOXtfe9yCKGNBbqfFgh5iAfYOMbay0v5Uyuvoeydo2q7xM4C/b3cCjKoXxDA5J
AMTCtGJWwmWqNAigh7hdnFaQb790DnVo23SakfgYooFnkjli4Vaa25sYdw3OokQM
MoEOfzj7yM8xOmABGfSq42GlTcXHpCh69C5TurGfNdad257PCjIwkUxpmVJ+EenS
jUrainWTBMe5InV7B5yP6FeClEQ/d6MvIUMTe9hq1mGCkovjmFleXPiukBmJ+UBC
R8aUO/N1tVLg6ZDVZAoFjIw5RtQm/abpDb5T86kO3HRFcIJRaf+/aARgmGan9cVR
+N/FoTgDkBOYoG/idDYZTTI7TE5FrzDADNInhQSqDB+1s3iT7qeADkfn8EThuj+H
VpWYoIF/m4Q6Y3p1excexuC7yXyp0JYuc3SLjrnZItP4jJKSwwQphhugsM528D3x
s9/CjlMlHbM8Ipq/sf4mV+HpddSP8wIDAQABAoICAGaFWYyhlFgH6UTBi2gYa5Mh
e62qLBZcYnLWkbkP99ru+MHQ6yJffWBYIqcXPb9kT7el7cfp8IU4uhJu+gi2eWy5
c2KIE3NlXo3pFZuWvczPiZVHF1hP/LwSWl/sj1AUBW2VDwpXLStKtHXYFoEi4YKi
joXf7SJdKSu86Yuo6OcHplLGnZnBye6XZCqGSlf2iqMsKVlVXhMFUdYDxJvBLk3c
GA5DUtsQvLQ5IqwCbvZr4bha2cWygOu3SLCpyKuAdGBL+MH225dyj46pKAyvEqJ6
ssBUzAZloKU3g5qANpoedZskkut9iycYutD8hb45CQVCwk7cjg+npSo1Mbdh+0Ke
C1Xpfkl7aRSNBwHuBSj8YiQBiLm45Lg1dWau5EiFtfru8n+1JR4OAjwepEVINyxP
NgpaORvw0+7uq3t07cLMx7CYrninqApGl9vpNYg1zyrES3LluGVcRAx5Di+O3XeH
1Wgw+woKvnIxfDPjtMfVtoi3FjYWQaSM7bJAcoBKwMCWNJJRLZWonXzpEM0D+zTK
ITe0lTBEaBZ3cwZEseuZkyTLOEKb+TJ38juhV7d/iQ7yW0okngPocC5n1gwRoIOB
M+4HBKsPOSmbeewLsNwgJImCNgdqYGY9vIa1KoID6rbEYqQ2yXje7c3gq/TozNDS
B/VpWjxDqQtePZ9yazWJAoIBAQDr+c/y7k/cXJssXW0YaJN3osAKLOQGSxgsHHLp
8Bm7Occ7taBLo3mwFBTkrCOJXbofO+fXE3bCOIH8bXGC4GRI8wNZ5e54s7YHNUBG
oZ/iu+ZWtRS1UsyyksWjzenFetPyVsGjX60gP7Atta7jFh76bCRwSruyUhqpJC0C
wwfHap7yyWxwyGpbGONDh7ZNbO4TU/WXZgufhlbXfHhdzADg5biAIeKWytAyY/6k
LouRe4uLYVWCoiYuM4p+pzDej2P6l8pEFXe+4uRGzY2pMVcRuB19m5PB3E43MMfA
ZXrvjHyFlKjvQMg4A7WvKqdgLIEalHYfaWaPvm585TIrul53AoIBAQDbeisLfMzY
qEWwAV4p8olUtmHBOxel68G8OS8Q1PgP84MA5QsmgPdcpR+prkNYaL3gS0t5/cjX
M6ng8y9CFOb6xtqF18Xt9p5zSf5g1vWu+bGvxoBubSUxs0Ul0fM6iAetqBAlxOjb
q7V8U7CB//i3Lze7yrxRl0APnyCLX0CHlnclS0qRDYjAMkZvnfVAeYBMaOt8r8zA
YVQoYmYCqiI+6cVq104rxzW7cx8l5Rn/opEKVV/yiHdm/BQ3AnCb9maCVXBDBFAt
GRDY9IM4j4cPzKP3ke5mleWlXthykMxjswot2UugbPakgST9dIl83r+V/uN6ltSs
40e4ghBnmM1lAoIBADGkZR3LCpvmE3La2KeI4HULlPDPDs1QIO6usXILY65ickpa
ZDVlV6U2JEsS94rfX9dQR+6UFqi3MIlFENsij5ZVIUBZQbi8va94gWQafkM5mjRl
dczLdWqfu9pA6Ev2Ef5qR+QxrX8aRtrm3LrDHZM7CtNgtWnHIfqxNJLfKpTGFlgn
DZwQXWd6rdy4AR76qn8Aa6sE+a7+mOhONBgvYYPub8js1/k3A2OGa7xoWk4pumqA
+Hc522RezWTlkT9Q1QyTwCZgicdrffBzL7kHOzTsEbAp+YSP7xhnN65+6sTYPh3v
7zYd38EA7sjB5WIzGpnX352uE7hrrFyz7sEKPPMCggEATB4FmblRrf5GFPGUf8XO
3SNXqdVdsTyfdzD54sOJuLaCg6fsAxGNOINIBOgcEShaWdSjO47JveD8FLkida+c
H/MhTHP2AD6c220ZHOrQUDvm5QhZ+HJACQmcfK5gxbbxusdjukWdYLofehvoRl3J
G3bzxFxejYmAPSq59bw2PA/yCGwhU0c3WzjUdtd4fEDnPxjQOvEZeMsIjez6Zggt
UlZvEkvTn5k6SGV3swPOzXrLBKNxYEL17jCUrjNZbK27BY6uHX/8cneUATpj3BTj
CZa2cyEYZlmsSHspZCpVyGoKqLYI5X2E2K61bnWhTT5Pgazhpd1zqvY0JIhvOg6j
hQKCAQB3TkNweTf/yLELCt/nC/Ism2PRyQoBVBi6hgcL6ZXvtzx5hiM4Yzt0zQWP
XI7q2qmjpd+dnVQENwWMLkMmdo7cjdYK6oh6nRTwqnY6fce6vqYIqSar/mlwVXVZ
GEaGKmyFPSLlb3s6Y9bjm4v7jTiepv0mb7Rbg8rUHLHuOjP+0oMq6g0t6c9vTRA6
/Zi1eFASEGuP5ZUxt6V0SIuxWNjmNvkV/yB8LgrrXKrd7ESzQHDcxlPnT+DT6J3S
Nb4W8Or5SBXih8YGGOB06h5mqAo3B5DsAMR22hgI3FWzwjhTY88kjZ7zyB+9k6Iz
0G2LEeo+WnnkOkbhA/xWY5VxCjs4
-----END PRIVATE KEY-----`;

  // Encrypted message
  const encryptedMainKey = `Lbkr8vxbhCK5ffcqpDNOWsP8361ynWzPwljVi71rNMIPmcy5LUT0sqSkVihvTyiVt9FAqVXALLEvhxdCZz/WpdghA85gykzCyhGqrXzcI9hPhbGGAzstamwgM/Amy7SjMbL2liDv76iSBKpqYLaboDdK1uqxr19PowXcdKu1HZqXRwaZDQmr14aYeCgG9fHIgbFU2ysRvr3G5ltp5+XO8LbxLYfbhtH5Y7fsnP9qXfWzElZjNTXe467LI/qigp2hFs+1nqSXPatYz/j6dzPF3DHxpc9PC/WFM1WiWyy0pVx6QTUqgnHuYNXd3ViF/tc1II4QnnPd+UmHreEUM1VC2G5BzBpSjmLRmxdwYiSTTZxLd9y7PWpnmv3WUz+Z5Nn5AuhzY6arnFHXpASuADSPm3GE2cySFurDLqGUorOMfP2SZq11SlikdtExT+tMj+hLss4cWw76u6mr2TU7y74fi18+PDzVOk+F689T+xV5wsPF/yHr78X6bFy4FqJy1w5moddVyCrFCARSr+q/3ahfo3v2aK1joc9Vm3ZsHrVjhanjMcXfSr2+eUwFqTIlljYnRpAICsL9uMbSn+rSz8tJecQvdOknnEYZBe1oXtvSUt+mKouVQEJvXWU7gECPiFk42q7jr9W3heeyIMu6PqLZFO2qWG4Vf6+dV+XRTXTqxFE=`;

  // AES-256 key and IV (Example values; replace with actual values)
  const aesKeyHex = 'e4ec96312b84802c0531e6e165edd640103d6e3762badcbbe566fe13e0155474';
  const ivBase64 = 'tcKbvvqwyfXVL0poP3xnCw==';

  const iv = Buffer.from(ivBase64, 'base64');
  const key = Buffer.from(aesKeyHex, 'hex');

  // Function to decrypt AES-256 encrypted message using node-forge
  const aes256Decrypt = (encryptedText: Uint8Array, key: any, iv: Uint8Array): string | null => {
    try {
      // Convert Uint8Array to forge buffer
      const encryptedTextBuffer = forge.util.createBuffer(encryptedText, 'raw');
      const keyBuffer = forge.util.createBuffer(key, 'raw');
      const ivBuffer = forge.util.createBuffer(iv, 'raw');

      // Create a forge cipher instance
      const decipher = forge.cipher.createDecipher('AES-CBC', keyBuffer);

      // // Start decryption with the given IV
      decipher.start({ iv: ivBuffer });

      // // Update the cipher with the encrypted text
      decipher.update(encryptedTextBuffer);

      // // Finalize the decryption
      const success = decipher.finish();

      // // Return the decrypted text as a UTF-8 string
      return success ? decipher.output.toString('utf8') : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Decryption error:', error.message);
      return null;
    }
  };

  const encryptedMessage = Buffer.from(encryptedMainKey, 'base64');

  // Convert private key to node-forge format
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPEM);

  // Decrypt the AES key using RSA
  const decryptedMessageBase64 = privateKey.decrypt(encryptedMessage, 'RSA-OAEP'); // Try RSA-OAEP padding

  // Decode the Base64-encoded AES-encrypted message
  const decodedMessage = forge.util.decode64(decryptedMessageBase64);
  const message = Buffer.from(decodedMessage, 'base64');

  // Decrypt the AES-encrypted message
  const finalMessage = aes256Decrypt(message, key, iv);
  // eslint-disable-next-line no-console
  console.log('Final Message', finalMessage);

  return (
    <Box bg="#3D075F">
      <SEO page="index" />
      <Grid filter={visible ? 'blur(8px)' : ''} position="relative">
        <Box display={{ base: 'none', md: 'block' }}>
          <video height="auto" width="100%" id="backgroud-video" autoPlay loop muted>
            <source src="./assets/video/bg-video.mp4" type="video/mp4" />
          </video>
        </Box>
        <Box display={{ base: 'block', md: 'none' }}>
          <video height="auto" width="100%" id="backgroud-video" autoPlay loop muted>
            <source src="./assets/video/bg-video-mobile.mp4" type="video/mp4" />
          </video>
        </Box>
        <Container maxW="1080px" position="absolute" mx="auto" left={0} right={0}>
          <Box>
            <TopBarHeader />
            <Box
              pb={{ base: '4rem', md: '5rem' }}
              display="flex"
              flexDir={{ base: 'column', md: 'row', lg: 'row', xl: 'column' }}
              alignItems="center"
              justifyContent="center"
            >
              <Flex placeContent="center">
                <Image
                  src={PhoneImage}
                  height={breakPoint === 'md' ? 200 : breakPoint === 'xl' ? 300 : 100}
                  width={breakPoint === 'md' ? 400 : breakPoint === '2xl' ? 600 : 400}
                  alt="Phone Image"
                  placeholder="empty"
                  style={{ objectFit: 'contain' }}
                />
              </Flex>
              <Box>
                <Text
                  fontSize={{ base: '2rem', md: '37px' }}
                  textAlign="center"
                  color="white"
                  fontFamily="'Coda', sans-serif"
                  fontWeight="extrabold"
                >
                  Pay Like It's <br /> Nobody's Business.
                  <br /> Because It Isn't.
                </Text>

                <Flex justifyContent="center">
                  <Flex
                    mt="1.5rem"
                    justifyContent="center"
                    bg="white"
                    borderRadius="2xl"
                    border="2px solid #D11CB6"
                    width={350}
                    p="0.5rem"
                    gap={2}
                  >
                    <Image
                      src={QrCodeImage}
                      height={85}
                      width={85}
                      alt="QR Code Image"
                      style={{ objectFit: 'contain' }}
                      placeholder="empty"
                    />
                    <Text textAlign="center" color="black" fontWeight="bold" fontSize="2rem" letterSpacing="tighter">
                      DOWNLOAD <br /> QUX PAY
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Container>
      </Grid>

      <Box
        h="130vh"
        bgImage={{
          base: "url('/assets/images/military-grade-security-4.webp')",
          md: "url('/assets/images/military-grade-security.webp')",
        }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      >
        <Content
          label="Military-Grade Security"
          content="QUXPay™ utilizes data protocols trusted by militaries and bank worldwide. Secure every payment. Your data
                stays private."
          onClick={(): void => void router.push('/military-grade-security')}
        />
      </Box>

      <Box
        h="100vh"
        bgImage={{ base: '', md: "url('/assets/images/no-middleman.webp')" }}
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
      >
        <Content
          label="NO MIDDLEMAN. NO NONSENSE."
          content="Unlike others, QUXPay™ has no hidden fees and will never sell your data for profit. What you see is what
          you get."
          alignItems="start"
          onClick={(): void => void router.push('/no-middleman')}
        />
        <Box display={{ base: 'flex', md: 'none' }} justifyContent="flex-end">
          <Image src="/assets/images/no-middleman.webp" alt="img" width={1000} height={1000} placeholder="empty" />
        </Box>
      </Box>

      <Box
        bgImage={{ base: '', md: "url('/assets/images/payments-made-perfect.webp')" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        pb={{ base: '', md: '10rem' }}
      >
        <Content
          label="P2P Payments Made Perfect"
          content="Pay friends, family, contacts instantly. No fees, no limits. Spend on the move."
          onClick={(): void => void router.push('/payments-made-perfect')}
        />
        <Box display={{ base: 'flex', md: 'none' }} justifyContent="center">
          <Image
            src="/assets/images/payments-made-perfect-4.webp"
            alt="img"
            width={1000}
            height={1000}
            placeholder="empty"
          />
        </Box>
      </Box>

      <Box
        bgImage={{ base: '', md: "url('/assets/images/transfers.webp')" }}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        py={{ base: '4rem', md: '12rem' }}
      >
        <Content
          label=" Transfers in a Flash"
          content="Amount transferred through QUXPay™ reaches its destination almost instantly. As quick as sending a text. No more waiting around like crypto."
          onClick={(): void => void router.push('/transfers')}
        />
        <Box display={{ base: 'flex', md: 'none' }} justifyContent="center">
          <Image src="/assets/images/transfers.webp" alt="img" width={1000} height={1000} placeholder="empty" />
        </Box>
      </Box>

      <Container maxW="1080px" color="white" textAlign="center" mt={{ base: '0', md: '15rem' }} mb="5rem">
        <Text fontSize={{ base: '2rem', md: '4rem' }} fontWeight="extrabold">
          The Future of Payments.
          <br /> Today.
        </Text>
        <Text fontSize={{ base: '1.25rem', md: '30px' }} mt="2rem">
          QUXPay™ combines must-have transfer features with next-gen tech insights.
          <br /> Monitor where your payments go.
        </Text>
      </Container>

      <Box
        h={{ base: '60vh', md: '100vh' }}
        bgImage="url('/assets/images/BG-5-v2.webp')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize={{ base: 'cover', md: 'contain' }}
        my={{ base: '3rem', md: 0 }}
      />

      <Footer />
    </Box>
  );
};

export default Home;
