import { Box, Button, Divider, Flex, Image as ChakraImage, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { QuxTokenIcon } from 'public/assets';
import { FC } from 'react';

const Label: FC<{ label: string; image: any; amount: number; loading: boolean }> = ({
    label,
    image,
    amount,
    loading,
}) => (
    <Flex fontSize="18px" justifyContent='space-between' alignItems="center" mt='0.5rem'>
        <Text w='auto'>{label}</Text>&nbsp;
        <Flex>
            <span>
                <Image src={image} width={24} height={20} alt="Qux Token" placeholder="blur" />
            </span>
            {!loading ? <> {amount}</> : <Spinner />}
        </Flex>
    </Flex>
);

const PaidPosInfoById: FC<{ data: any, loading: boolean }> = ({ data, loading }) => {
    const router = useRouter()
    return <>
        <Box color='white' mt='2rem'>
            <Text >
                Sending to {data?.po_to} for
            </Text>
            <Text my='0.5rem' ml='1rem'>PO {data?.id}</Text>

            <Label label="Token Amount:" image={QuxTokenIcon} amount={data?.amount} loading={loading} />
            <Label label="Token Fee:" image={QuxTokenIcon} amount={data?.token_fee} loading={loading} />
            <Label label="Total Token amount:" image={QuxTokenIcon} amount={data?.total_amount} loading={loading} />


            <Box mt='2rem'>
                {
                    data?.selected_products?.map((item) => (
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
            </Box>

            <Flex alignItems='center' flexDir='column' gap='1rem' my="2rem">
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
    </>
}

export default PaidPosInfoById