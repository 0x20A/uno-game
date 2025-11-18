import { Link } from 'react-router';
import bg from '../../assets/Home-bg.png';
import logo from '../../assets/UNO_Logo.svg.png';

export const Home = () => {
  return (
    <div
      className='bg-cover bg-center min-h-screen flex flex-col items-center p-20'
      style={{ backgroundImage: `url(${bg})` }}
    >
      <img src={logo} alt='UNO' className='z-1000 w-80' />

      <Link
        to='/uno'
        className='bg-amber-300 rounded-md text-white py-5 px-10 text-2xl font-bold mt-30 cursor-pointer transition hover:scale-110 active:scale-100 shadow-[0_5px_10px_rgba(0,0,0,1)]'
      >
        Jugar
      </Link>
    </div>
  );
};
