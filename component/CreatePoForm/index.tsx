import { Avatar, Box, Button, Checkbox, Divider, Flex, Image as ChakraImage, Radio, RadioGroup, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Label } from 'component/PaidPosInfoById';
import ProductModal from 'component/ProductModal';
import { TextField } from 'component/TextField';
import { FETCH_FRIEND_LIST, FETCH_PRODUCT_LIST, FETCH_RECENT_PRODUCT_LIST } from 'constants/api';
import { STAGING_URL } from 'constants/url';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AddFriendIcon, QuxTokenIcon } from 'public/assets';
import { FC, useState } from "react";
import { useMutation, useQuery } from 'react-query';
import { useProductModal } from 'store/useProductModal';
import errorHandler from 'utils/errorHandler';
import { notify } from 'utils/notify';




const CreatePoForm: FC = () => {
    const router = useRouter()
    const setVisible = useProductModal(e => e.setVisible)
    const { data } = useQuery('productList', FETCH_PRODUCT_LIST, errorHandler);
    const [step, setStep] = useState(1)
    const { data: recentProductData, isLoading: loading } = useQuery('recentProduct', FETCH_RECENT_PRODUCT_LIST, errorHandler)
    const { data: friendData } = useQuery('friendList', FETCH_FRIEND_LIST, errorHandler);
    const [radioValue, setRadioValue] = useState('');
    const [emailValue, setEmailValue] = useState('')
    const [selectedFriend, setSelectedFriend] = useState()
    const [qrUrl, setQrUrl] = useState()
    const [trigger, setTrigger] = useState(false)
    const productValue = useProductModal(e => e.productValue)
    const { mutate } = useMutation(
        (variable) =>
            axios.post(`${STAGING_URL}/web/generate/cart/qr`, variable, {
                headers: {
                    Authorization: `Bearer ${typeof window !== 'undefined' && localStorage.QUX_PAY_USER_TOKEN}`,
                },
            }),
        {
            onSuccess: ({ data }) => {
                setQrUrl(data?.data?.qr_code)
                setTrigger(data?.status?.success)
            },
            onError: () => {
                notify(`Failed to generate QR`, { status: 'error' });
            },
        }
    );



    const onSubmit = (): void => {


        if (step === 1) {
            setStep((e) => e + 1);
            return;
        }

        if (step === 2) {
            mutate({
                product_po: true,
                filed_to: selectedFriend,
                filed_to_using_email: emailValue,
                sku: productValue
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any)
        }

    }

    return (
        <>
            {trigger
                ?
                <Flex flexDir='column' justifyContent='center' alignItems='center' color='white' textAlign='center'>
                    <Text my='2rem' fontWeight='semibold'>Please have your friend or visitor<br /> scan this code</Text>
                    <ChakraImage src={qrUrl} alt="Qr Code" w='100%' h='100%' p='1.5rem' />
                    <Button
                        variant="secondary"
                        borderRadius="1rem"
                        w={350}
                        h="3.25rem"
                        mt='4rem'
                        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                        onClick={() => router.push('/dashboard')}
                    >
                        Go Back
                    </Button>
                </Flex>
                :
                <Box color='white'>
                    {step === 1 &&
                        <>
                            <Text ml='2.25rem' my='0.5rem' fontSize='12px' fontWeight='semibold' >Select Products To Add:</Text>
                            <Box>
                                <Text fontSize='2rem' fontWeight='semibold'>Recent Products</Text>

                                <Box mt='2rem'>
                                    {
                                        recentProductData?.length ? <>
                                            {
                                                recentProductData?.map((item) => (
                                                    <>
                                                        {!item?.skus?.length ? <></> :
                                                            <>
                                                                <Flex height={100} justifyContent='space-between' key={item.id} mt='1rem' px='1rem'>
                                                                    <Flex gap={4}>
                                                                        <Box height={80} >
                                                                            <ChakraImage
                                                                                src={`${item.images}`}
                                                                                height='80px'
                                                                                width='80px'
                                                                                alt={item.product}
                                                                                objectFit='cover'
                                                                            />
                                                                        </Box>
                                                                        <Box fontSize="18px">
                                                                            <Text mb='0.5rem'>{item.name}</Text>
                                                                            <Text>
                                                                                Variation: {item.skus?.length}
                                                                            </Text>
                                                                        </Box>
                                                                    </Flex>
                                                                    <Checkbox onChange={(): void => setVisible(true)} />

                                                                </Flex>
                                                                <Divider />
                                                                <ProductModal data={item} />
                                                            </>
                                                        }
                                                    </>
                                                )
                                                )
                                            }
                                        </> : <>No Record</>
                                    }
                                </Box>
                            </Box>


                            <Box mt='2rem'>
                                <Text fontSize='2rem' fontWeight='semibold'>All Products</Text>
                                <TextField
                                    type="email"
                                    value={''}
                                    placeholder="Search By Product Name"
                                    // eslint-disable-next-line no-console
                                    onChange={(e): void => console.log(e.target.value)}
                                />


                                <Box mt='2rem'>
                                    {
                                        data?.length ? <>
                                            {
                                                data?.map((item) => (
                                                    <>
                                                        {!item?.skus?.length ? <></> :
                                                            <Box key={item.id}>
                                                                <Flex height={100} justifyContent='space-between' mt='1rem' px='1rem'>
                                                                    <Flex gap={4}>
                                                                        <Box height={80} >
                                                                            <ChakraImage
                                                                                src={`${item.images}`}
                                                                                height='80px'
                                                                                width='80px'
                                                                                alt={item.product}
                                                                                objectFit='cover'
                                                                            />
                                                                        </Box>
                                                                        <Box fontSize="18px">
                                                                            <Text mb='0.5rem'>{item.name}</Text>
                                                                            <Text>
                                                                                Variation: {item.skus?.length}
                                                                            </Text>
                                                                        </Box>
                                                                    </Flex>
                                                                    <Checkbox onChange={(): void => setVisible(true)} />

                                                                </Flex>
                                                                <Divider />
                                                                <ProductModal data={item} />
                                                            </Box>
                                                        }
                                                    </>
                                                )
                                                )
                                            }
                                        </> : <>No Record</>
                                    }
                                </Box>
                            </Box>

                            <Box my='1rem'>
                                <Label label="Token Amount:" image={QuxTokenIcon} amount={0.0} loading={loading} />
                                <Label label="Token Fee:" image={QuxTokenIcon} amount={0.0} loading={loading} />
                                <Label label="Total Token amount:" image={QuxTokenIcon} amount={0.0} loading={loading} />
                            </Box>
                        </>
                    }

                    {step === 2 &&
                        <>
                            <Flex>
                                <Text color="white" fontSize="2.5rem">
                                    My Friends
                                </Text>
                            </Flex>
                            <RadioGroup onChange={setRadioValue} value={radioValue}>
                                {friendData?.length ? (
                                    <>
                                        {!loading ? (
                                            friendData.map((item, index) => {
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
                                            <Image src={AddFriendIcon} alt="Add Bank Icon" />
                                        </Box>

                                        <Text ml="0.5rem" color="white" fontSize="1.25rem">
                                            Add New Friend
                                        </Text>
                                    </Flex>

                                    <Radio value={`${data?.length + 1}`} colorScheme="teal" />
                                </Flex>
                            </RadioGroup>

                            {radioValue !== `${data?.length + 1}` ? (
                                <></>
                            ) : (
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
                                        value={emailValue || ''}
                                        placeholder="Enter Username or Email"
                                        onChange={(e): void => setEmailValue(e.target.value)}
                                    />

                                </>
                            )}
                        </>
                    }

                    <Flex alignItems='center' flexDir='column' gap='1rem' my="2rem">
                        {step !== 2 &&
                            <Button
                                type="submit"
                                variant="primary"
                                borderRadius="1rem"
                                w={350}
                                h="3.25rem"
                                onClick={onSubmit}
                                isDisabled={!productValue}
                            >
                                Create PO
                            </Button>}

                        <Button
                            type="submit"
                            variant="primary"
                            borderRadius="1rem"
                            w={350}
                            h="3.25rem"
                            onClick={onSubmit}
                            disabled={true}
                            isDisabled={!productValue}
                        >
                            Send To User
                        </Button>

                        <Button
                            type="submit"
                            variant="secondary"
                            borderRadius="1rem"
                            w={350}
                            h="3.25rem"
                            onClick={(): void => void router.push('/dashboard')}
                        >
                            Cancel
                        </Button>
                    </Flex>

                </Box>
            }
        </>
    )
}

export default CreatePoForm