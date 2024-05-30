import { useContext } from 'react';
import { LoadingContext } from '@/myproviders/loading.context';

import React, { FC } from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Slider, { Settings } from 'react-slick'
import Typography from '@mui/material/Typography'
import { useTheme, styled } from '@mui/material/styles'
import { IconButton, useMediaQuery } from '@mui/material'
import IconArrowBack from '@mui/icons-material/ArrowBack'
import IconArrowForward from '@mui/icons-material/ArrowForward'
import { Image } from 'next/image';

// import { data } from './popular-course.data'
import { CourseCardItem } from '@/components/course'

import { hooks } from "../../connectors/metaMask";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;

interface SliderArrowArrow {
  onClick?: () => void
  type: 'next' | 'prev'
  className?: 'string'
}

const SliderArrow: FC<SliderArrowArrow> = (props) => {
  const { onClick, type, className } = props
  return (
    <IconButton
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
        bottom: { xs: '-70px !important', md: '-28px !important' },
        left: 'unset !important',
        right: type === 'prev' ? '60px !important' : '0 !important',
        zIndex: 10,
        boxShadow: 1,
      }}
      disableRipple
      color="inherit"
      onClick={onClick}
      className={className}
    >
      {type === 'next' ? <IconArrowForward sx={{ fontSize: 22 }} /> : <IconArrowBack sx={{ fontSize: 22 }} />}
    </IconButton>
  )
}

const StyledDots = styled('ul')(({ theme }) => ({
  '&.slick-dots': {
    position: 'absolute',
    left: 0,
    bottom: -20,
    paddingLeft: theme.spacing(1),
    textAlign: 'left',
    '& li': {
      marginRight: theme.spacing(2),
      '&.slick-active>div': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
}))

const MyNFTs: FC = ({ nftInfo }) => {

  const { loading, setLoading } = useContext(LoadingContext);

  const provider = useProvider();
  const userAccounts = useAccounts();
  const isActive = useIsActive();

  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(nftInfo.userNFTs);
  }, [nftInfo])

  const sliderConfig: Settings = {
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: matchMobileView ? 1 : 3,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots) => <StyledDots>{dots}</StyledDots>,
    customPaging: () => (
      <Box sx={{ height: 8, width: 30, backgroundColor: 'divider', display: 'inline-block', borderRadius: 4 }} />
    ),
  }

  const fetchContractData = async () => {
    try {
      // setMaxMintAmountPerTx(nftInfo.maxMintAmountPerTx);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchContractData();
    }
  }, [nftInfo]);

  return (

    <Box sx={{
      backgroundColor: '#111315',
      // pt: 4,
      backgroundImage: `url(https://wonderfulwebsites.com/wp-content/uploads/2022/12/webinar-bg.jpg)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      width: '100%',
    }}>
      <Grid container direction="column" alignItems='center'>
        <Grid item justifyContent='center' sx={{
          width: '100%',
          background: '#111315',
          textAlign: 'center',
          py: '20px',
        }}>
          <Typography variant="h1" sx={{
            color: 'white', my: 2, fontSize: '56px', letterSpacing: '10px'
          }}>
            My NFTs
          </Typography>
        </Grid>

        <Grid item container direction="row" sx={{ width: '90%' }}>
          {/* <Slider {...sliderConfig}> */}
          {data?.map((item) => (
            <Grid item xs={12} md={3} sx={{ p: '20px' }}>
              <CourseCardItem key={String(item.id)} mode={nftInfo?.itemsStaked?.includes(item.id)} item={item} />
            </Grid>
          ))}
          {/* </Slider> */}
        </Grid>
      </Grid>
    </Box >
  )
}

export default MyNFTs
