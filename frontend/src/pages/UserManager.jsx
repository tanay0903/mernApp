import Headercrud from '../components/Headercrud';
import CrudApp from '../components/CrudApp'; 

const UserManager = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url(../bg_img.png)] bg-cover bg-center'>
      <Headercrud/>
      <CrudApp />
    </div>
  );
};
export default UserManager;
