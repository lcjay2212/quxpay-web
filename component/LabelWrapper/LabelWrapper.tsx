import { Flex, Spinner, Text } from '@chakra-ui/react';
import { QuxTokenFeeModal } from 'component/Modal';
import Image from 'next/image';
import { FC } from 'react';
import { useQuxPayFeeModal } from 'store/useQuxPayFeeModal';

export const Label: FC<{ label: string; image: any; amount: number; loading: boolean }> = ({
  label,
  image,
  amount,
  loading,
}) => {
  const [visible, setVisible] = useQuxPayFeeModal(({ visible, setVisible }) => [visible, setVisible]);
  return (
    <>
      <Flex fontSize="18px" justifyContent="space-between" alignItems="center" mt="0.5rem">
        <Flex>
          <Text w="auto">{label}</Text>&nbsp;
          {label === 'Token Fee:' && (
            <Text
              bg="gray"
              borderRadius="50%"
              w="20px"
              h="20px"
              textAlign="center"
              fontSize="12px"
              color="black"
              mt="4px"
              fontWeight="bold"
              pt="1px"
              cursor="pointer"
              onClick={(): void => setVisible(!visible)}
            >
              ?
            </Text>
          )}
        </Flex>
        <Flex>
          <span>
            <Image src={image} width={24} height={20} alt="Qux Token" />
          </span>
          {!loading ? <> {amount.toFixed(2)}</> : <Spinner />}
        </Flex>
      </Flex>
      <QuxTokenFeeModal />
    </>
  );
};
