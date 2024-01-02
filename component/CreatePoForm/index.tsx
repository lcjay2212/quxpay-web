import { Box, Button, Divider, Flex, Image as ChakraImage, Text } from '@chakra-ui/react';
import { Label } from 'component/PaidPosInfoById';
import { TextField } from 'component/TextField';
import { FETCH_PRODUCT_LIST, FETCH_RECENT_PRODUCT_LIST } from 'constants/api';
import { useRouter } from 'next/router';
import { QuxTokenIcon } from 'public/assets';
import { FC } from "react";
import { useQuery } from 'react-query';
import errorHandler from 'utils/errorHandler';
const CreatePoForm: FC = () => {
    const router = useRouter()
    const { data } = useQuery('productList', FETCH_PRODUCT_LIST, errorHandler);
    const { data: recentProductData, isLoading: loading } = useQuery('recentProduct', FETCH_RECENT_PRODUCT_LIST, errorHandler)
    return (
        <Box color='white'>
            <Text ml='2.25rem' my='0.5rem' fontSize='12px' fontWeight='semibold' >Select Products To Add:</Text>

            <Box>
                <Text fontSize='2rem' fontWeight='semibold'>Recent Products</Text>



                <Box mt='2rem'>
                    {
                        recentProductData?.lenght ? <>
                            {
                                recentProductData?.map((item) => (
                                    <>
                                        <Flex height={100} justifyContent='space-between' key={item.id} >
                                            <Flex gap={4}>
                                                <Box height={80} >
                                                    <ChakraImage
                                                        src={`${item.product_image}`}
                                                        height='80px'
                                                        width='80px'
                                                        alt={item.product}
                                                    />
                                                </Box>
                                                <Box fontSize="18px">
                                                    <Text mb='0.5rem'>Q{item.product}</Text>
                                                    <Text>
                                                        Variation: {item.variation}
                                                    </Text>
                                                </Box>

                                            </Flex>
                                        </Flex>
                                        <Divider />
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
                        data?.lenght ? <>
                            {
                                data?.map((item) => (
                                    <>
                                        <Flex height={100} justifyContent='space-between' key={item.id} >
                                            <Flex gap={4}>
                                                <Box height={80} >
                                                    <ChakraImage
                                                        src={`${item.product_image}`}
                                                        height='80px'
                                                        width='80px'
                                                        alt={item.product}
                                                    />
                                                </Box>
                                                <Box fontSize="18px">
                                                    <Text mb='0.5rem'>Q{item.product}</Text>
                                                    <Text>
                                                        Variation: {item.variation}
                                                    </Text>
                                                </Box>

                                            </Flex>
                                        </Flex>
                                        <Divider />
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

            <Flex alignItems='center' flexDir='column' gap='1rem' my="2rem">
                <Button
                    type="submit"
                    variant="primary"
                    borderRadius="1rem"
                    w={350}
                    h="3.25rem"
                >
                    Create PO
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    borderRadius="1rem"
                    w={350}
                    h="3.25rem"
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
    )
}

export default CreatePoForm