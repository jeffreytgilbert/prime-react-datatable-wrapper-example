import { Box, Loader } from '@mantine/core';

export const LoadingData = () => {
  return (
    <Box size="lg" display="flex" style={{alignItems: 'center', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', minHeight: '50vh'}}>
      <Loader />
    </Box>
  )
}
