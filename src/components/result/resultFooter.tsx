"use client";

import {
  Box, 
  Typography,
} from "@mui/material";
import Image from 'next/image';


export default function ResultFooter() {
    
const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};


  return (
      <Box sx={{
        display:"flex",flexFlow:"column",alignItems:"center",
        width: '100%',zIndex:10, background:"white",
        '@media print': {
          position: 'fixed',
        bottom:0}
          }}>
          <Typography textAlign={"center"} width={100} marginBlock={5} marginBottom={2} borderTop={1} fontSize={14}>Signature</Typography>

        <Box  borderTop={2} width={"100%"}>
           <Box sx={{display:"flex" ,paddingInline:2,justifyContent:"space-between" ,alignItems:"center"}}>
                <Typography fontSize={12} width={200}>
                   Date {getFormattedDateTime()}
                </Typography>
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} flexGrow={1}>
                    <Typography fontWeight={600} fontSize={15}>
                       GYMSCORE
                    </Typography>
                    <Typography fontSize={12}>
                       Advanced Gymnastics Scoring System
                    </Typography >
                </Box>
                <Typography fontSize={12}  width={200} textAlign={"end"}>
                  Page 1
                </Typography>
           </Box>
          
         <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} paddingInline={"20%"} paddingBottom={1}>
            <Image src={"/logo/QIG.png"} alt="QIG" width={100} height={50}></Image>
            <Image src={"/logo/TaiShan.png"} alt="TaiShan" width={100} height={20}></Image>
            <Image src={"/logo/lample.jpg"} alt="lample" width={100} height={30}></Image>
         </Box>
        </Box>
      </Box>
  );
}
