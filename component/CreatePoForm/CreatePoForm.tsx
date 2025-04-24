import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Image as ChakraImage,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Label, ProductModal, TextField } from 'component';
import { FETCH_PRODUCT_LIST, FETCH_RECENT_PRODUCT_LIST } from 'constants/api';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useProductModal } from 'store';
import { useDecryptedData } from 'store/useDecryptedData';
import { notify } from 'utils';

export const CreatePoForm: FC = () => {
  const router = useRouter();
  const setVisible = useProductModal((e) => e.setVisible);
  const { data } = useQuery({ queryKey: ['productList'], queryFn: FETCH_PRODUCT_LIST });
  const [step, setStep] = useState(1);
  const { data: recentProductData, isLoading: loading } = useQuery({
    queryKey: ['recentProduct'],
    queryFn: FETCH_RECENT_PRODUCT_LIST,
  });
  const { data: friendData, dataLoading } = useDecryptedData('friends');
  const [radioValue, setRadioValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [associateEmail, setAssociateEmail] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<number | null>();
  const [visible, setSuccessVisible] = useState(false);
  const productValue = useProductModal((e) => e.productValue);
  const setProductValue = useProductModal((e) => e.setProductValue);
  const [trigger, setTrigger] = useState(false);
  const [qrUrl, setQrUrl] = useState();
  const [searchProduct, setSearchProduct] = useState('');
  const price = useProductModal((e) => e.price);
  const amount = (price || 0) * (productValue?.[0].quantity || 0);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variable) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/web/generate/cart/qr`, variable, {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' && sessionStorage.QUX_PAY_USER_TOKEN}`,
          Version: 2,
        },
      }),
    onSuccess: ({ data }) => {
      if (step === 1) {
        setQrUrl(data?.data?.qr_code);
        setTrigger(data?.status?.success);
      } else {
        setSuccessVisible(data?.status?.success);
      }
    },
    onError: () => {
      notify(`Failed to generate QR`, { status: 'error' });
    },
  });

  const onSubmit = (): void => {
    if (step === 1) {
      setStep((e) => e + 1);
      return;
    }

    if (step === 2) {
      void mutateAsync({
        product_po: true,
        filed_to: selectedFriend,
        filed_to_using_email: emailValue || associateEmail,
        sku: productValue,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
  };

  return (
    <>
      {trigger ? (
        <Flex flexDir="column" justifyContent="center" alignItems="center" color="white" textAlign="center" mx="1rem">
          <Text my="2rem" fontWeight="semibold">
            Please have your friend or visitor
            <br /> scan this code
          </Text>
          <Flex flexDir="column" bg="white" borderRadius="xl" w="100%" justifyContent="center" alignItems="center">
            <ChakraImage src={qrUrl} alt="Qr Code" w="230px" h="100%" p="1.5rem" />

            <Box my="1rem" color="black">
              <Label
                label="Token Amount:"
                image="/assets/icons/qux-token.webp"
                amount={amount || 0.0}
                loading={loading}
              />
              <Label
                label="Total Token amount:"
                image="/assets/icons/qux-token.webp"
                amount={amount || 0.0}
                loading={loading}
              />
            </Box>
          </Flex>
          <Button
            variant="secondary"
            borderRadius="1rem"
            w={350}
            h="3.25rem"
            mt="4rem"
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onClick={() => router.push('/dashboard')}
          >
            Go Back
          </Button>
        </Flex>
      ) : (
        <Box color="white" px="1rem">
          {step === 1 && (
            <>
              <Text ml="2.25rem" my="0.5rem" fontSize="12px" fontWeight="semibold">
                Select Products To Add:
              </Text>
              <Box>
                <Text fontSize="2rem" fontWeight="semibold">
                  Recent Products
                </Text>

                <Box mt="2rem">
                  {recentProductData?.length ? (
                    <>
                      {recentProductData?.map((item) => (
                        <>
                          {!item?.skus?.length ? (
                            <></>
                          ) : (
                            <>
                              <Flex height={100} justifyContent="space-between" key={item.id} mt="1rem" px="1rem">
                                <Flex gap={4}>
                                  <Box height={80}>
                                    <ChakraImage
                                      src={`${item.images}`}
                                      height="80px"
                                      width="80px"
                                      alt={item.product}
                                      objectFit="cover"
                                    />
                                  </Box>
                                  <Box fontSize="18px">
                                    <Text mb="0.5rem">{item.name}</Text>
                                    <Text>Variation: {item.skus?.length}</Text>
                                  </Box>
                                </Flex>
                                <Checkbox onChange={(): void => setVisible(true)} />
                              </Flex>
                              <Divider />
                              <ProductModal data={item} />
                            </>
                          )}
                        </>
                      ))}
                    </>
                  ) : (
                    <>No Record</>
                  )}
                </Box>
              </Box>

              <Box mt="2rem">
                <Text fontSize="2rem" fontWeight="semibold">
                  All Products
                </Text>
                <TextField
                  type="email"
                  value={searchProduct}
                  placeholder="Search By Product Name"
                  // eslint-disable-next-line no-console
                  onChange={(e): void => setSearchProduct(e.target.value)}
                />

                <Box mt="2rem">
                  {data?.length ? (
                    <>
                      {data?.map((item) => (
                        <>
                          {!item?.skus?.length ? (
                            <></>
                          ) : (
                            <Box key={item.id}>
                              <Flex height={100} justifyContent="space-between" mt="1rem" px="1rem">
                                <Flex gap={4}>
                                  <Box height={80}>
                                    <ChakraImage
                                      src={`${item.images}`}
                                      height="80px"
                                      width="80px"
                                      alt={item.product}
                                      objectFit="cover"
                                    />
                                  </Box>
                                  <Box fontSize="18px">
                                    <Text mb="0.5rem">{item.name}</Text>
                                    <Text>Variation: {item.skus?.length}</Text>
                                  </Box>
                                </Flex>
                                <Checkbox onChange={(): void => setVisible(true)} />
                              </Flex>
                              <Divider />
                              <ProductModal data={item} />
                            </Box>
                          )}
                        </>
                      ))}
                    </>
                  ) : (
                    <>No Record</>
                  )}
                </Box>
              </Box>

              <Box my="1rem">
                <Label label="Token Amount:" image="/assets/icons/qux-token.webp" amount={amount} loading={loading} />
                <Label
                  label="Total Token amount:"
                  image="/assets/icons/qux-token.webp"
                  amount={amount || 0.0}
                  loading={loading}
                />
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Flex>
                <Text color="white" fontSize="2.5rem">
                  My Friends
                </Text>
              </Flex>
              <RadioGroup onChange={setRadioValue} value={radioValue}>
                {friendData?.friends?.length ? (
                  <>
                    {!dataLoading ? (
                      friendData?.friends?.map((item, index) => {
                        return (
                          <>
                            <Flex justifyContent="space-between" key={index}>
                              <Box mt="1rem">
                                <Flex justifyContent="flex-start">
                                  <Avatar name={item.name} />
                                  <Box w={200} textAlign="start" ml="1rem">
                                    <Text>{item.name}</Text>
                                    <Text>Username: {item.username ?? 'N/A'}</Text>
                                  </Box>
                                </Flex>
                              </Box>
                              <Radio
                                value={`${index + 1}`}
                                colorScheme="teal"
                                onChange={(): void => {
                                  setSelectedFriend(item?.id);
                                  setEmailValue(item?.email);
                                }}
                              />
                            </Flex>
                            <Divider mt="1rem" />
                          </>
                        );
                      })
                    ) : (
                      <Spinner />
                    )}
                  </>
                ) : (
                  <></>
                )}

                <Flex my="1.5rem" justifyContent="space-between">
                  <Flex>
                    <Box ml="1rem">
                      <Image src="/assets/icons/add-friend-icon.webp" alt="Add Bank Icon" />
                    </Box>

                    <Text ml="0.5rem" color="white" fontSize="1.25rem">
                      Add New Friend
                    </Text>
                  </Flex>

                  <Radio
                    value={`${friendData?.friends?.length + 1}`}
                    onClick={(): void => setEmailValue('')}
                    colorScheme="teal"
                  />
                </Flex>
              </RadioGroup>

              {radioValue === `${friendData?.friends?.length + 1}` && (
                <>
                  <TextField
                    type="email"
                    value={emailValue || ''}
                    placeholder="Enter Username or Email"
                    onChange={(e): void => setEmailValue(e.target.value)}
                  />

                  <Text color="white" fontSize="2.5rem">
                    My Associates
                  </Text>
                  <TextField
                    type="email"
                    value={associateEmail || ''}
                    placeholder="Enter Username or Email"
                    onChange={(e): void => setAssociateEmail(e.target.value)}
                  />
                </>
              )}
            </>
          )}

          <Flex alignItems="center" flexDir="column" gap="1rem" my="2rem">
            {step !== 2 && (
              <Button
                type="submit"
                variant="primary"
                borderRadius="1rem"
                w={350}
                h="3.25rem"
                onClick={(): void =>
                  void mutateAsync({
                    product_po: true,
                    sku: productValue,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any)
                }
                isDisabled={!productValue}
                isLoading={isPending}
              >
                Create PO
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              borderRadius="1rem"
              w={350}
              h="3.25rem"
              onClick={onSubmit}
              disabled={true}
              isDisabled={
                step === 1
                  ? !productValue
                  : radioValue !== `${friendData?.friends?.length + 1}`
                  ? !selectedFriend
                  : isEmpty(associateEmail) && isEmpty(emailValue)
              }
              isLoading={isPending}
            >
              Send To User
            </Button>

            <Button
              type="submit"
              variant="secondary"
              borderRadius="1rem"
              w={350}
              h="3.25rem"
              onClick={(): void => {
                setProductValue(null);
                setSelectedFriend(null);
                void router.push('/dashboard');
              }}
            >
              Cancel
            </Button>
          </Flex>

          <Modal isOpen={visible} onClose={(): void => setVisible(visible)} size="sm" isCentered>
            <ModalOverlay />
            <ModalContent bg="#515051" borderRadius="1rem">
              <ModalBody color="white" pb={6} textAlign="center">
                <Flex flexDir="column">
                  <Text fontSize="14px" mt="1rem" mb="4rem" fontWeight="bold">
                    Your PO has been sent to <br /> {emailValue}
                  </Text>
                  <Button
                    variant="primary"
                    mt="1rem"
                    onClick={(): void => {
                      setSuccessVisible(!visible);
                      void router.push('/dashboard');
                    }}
                  >
                    Great!
                  </Button>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </>
  );
};
