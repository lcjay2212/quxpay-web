import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
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

const PosInfoById: FC<{ data: any, loading: boolean }> = ({ data, loading }) => {
    const router = useRouter()
    return <>
        <Box color='white' mt='2rem' h='80vh'>
            <Text >
                Sending to {data?.po_to} for
            </Text>
            <Text my='0.5rem' ml='1rem'>PO {data?.id}</Text>

            <Label label="Token Amount:" image={QuxTokenIcon} amount={data?.amount} loading={loading} />
            <Label label="Token Fee:" image={QuxTokenIcon} amount={data?.token_fee} loading={loading} />
            <Label label="Total Token amount:" image={QuxTokenIcon} amount={data?.total_amount} loading={loading} />

            <Flex alignItems='center' flexDir='column' gap='1rem' my="2rem">
                <Button
                    type="submit"
                    variant="primary"
                    borderRadius="1rem"
                    w={350}
                    h="3.25rem"
                >
                    Re-Send PO
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

                <Button
                    type="submit"
                    variant="delete"
                    borderRadius="1rem"
                    w={350}
                    h="3.25rem"
                    disabled
                >
                    Delete PO
                </Button>
            </Flex>
        </Box>
    </>
}

export default PosInfoById