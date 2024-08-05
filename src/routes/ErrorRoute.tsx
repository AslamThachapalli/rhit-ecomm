import { Button, Typography } from '@material-tailwind/react';
import ErrorSvg  from '/svg/error-page-illustration.svg';
import { useNavigate } from 'react-router-dom';

export default function ErrorRoute() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center h-screen mx-2">
            <img className='bg-none' src={ErrorSvg} alt="Your SVG" />
            <Typography variant='h1' className='mt-2'>Oops!</Typography>
            <Typography className='text-2xl sm:text-4xl font-medium mt-1'>We couldn't find this page.</Typography>
            <Typography className='text-lg sm:text-2xl mt-5'>Let's find a better place for you to go.</Typography>
            <Button color='indigo' className='mt-4' onClick={() => navigate('/', {replace: true})}>Go to home</Button>
        </div>
    )
}