
////////////////// Loading provider //////////////////////

import { useContext, useEffect, useState } from 'react'
import { LoadingContext, LoadingProvider } from '@/myproviders/loading.context'
import { CircularProgress, Box, Typography } from '@mui/material';

export const GlobalLoading = () => {
    const { loading, description } = useContext(LoadingContext);

    return (
        <div>
            {loading > 0 ? (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    zIndex: '4000',
                    backgroundColor: 'rgba(0,0,0,0.7)',

                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        bgcolor: 'rgba(255,0,200,0.2)',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                    }}>
                        <CircularProgress color='error' size={100} />
                        <Typography variant='h1' sx={{ color: 'white', mt: 2, letterSpacing: '2px' }}>
                            {description} ...
                        </Typography>
                    </Box>
                </Box>
            ) : null}
        </div>
    );
};