import Link from 'next/link';
import { useRouter } from 'next/router';

import { SubmitHandler, useForm } from 'react-hook-form';
import { signin } from '../../api/users';
import AuthLayout from '../../components/Layout/AuthLayout';
import toastr from "toastr"
import 'toastr/build/toastr.min.css'

type Props = {}
type form = {
  email: string,
  password: string,
}
const Signin = (props: Props) => {

  const { register, handleSubmit, formState: { errors } } = useForm<form>();
  const router = useRouter();

  const onSubmit: SubmitHandler<any> = data => {
    // console.log(data)
    signin(data).then((res: any) => {
      localStorage.setItem('user', JSON.stringify(res.user))
      toastr.success("chào mừng bạn quay trở lại")
      router.push('/')
    })
  }


  return (
    <div className='overflow-hidden h-[100vh]'>
      <Link href={'/'}><button className='relative mbs:hidden mb:block top-[50px] left-[100px] border bg-[#fac26f] hover:bg-[#fed496] px-6 py-2 rounded-full text-white'>Trở về</button></Link>
      <div className='flex items-center h-[100vh] justify-center'>

        <div className="mb:w-[70%] mbs:mx-[20px] mbs:w-[100%] h-[600px]  shadow-2xl rounded-xl mx-auto  flex justify-between items-center">
          <div className='maskgroup relative mbs:hidden mb:block  w-[366px] h-[600px] shadow-2xl shadow-[#ffd79a] bg-[#fed496] overflow-hidden rounded-[30px] '>
            <div className="a bg-[#efce90] h-[70%] rounded-bl-[108px]"><h2 className='pt-[300px] font-bold text-[50px] leading-[53px] pl-[15px] text-white'>Happy <p className='pl-[20px]'>Weekend</p></h2></div>
            <div className="b absolute top-[-50px] right-[-60px] w-[196px] h-[187px] bg-[#fbf1cf] overflow-hidden rounded-tl-[200px] rounded-bl-[200px]">a</div>
            <div className="c absolute bottom-[-50px] left-[-20px] w-[196px] h-[187px] rounded-tr-[108px] rounded-br-[20px]  bg-[#fbf1cf]  ">b</div>
          </div>
          <div className='form mx-[auto] mb:w-[50%] mbs:w-[90%]'>
            <Link className='text-right' href={'/'}><span className='flex justify-end'><button className='mbs:block mb:hidden border bg-[#fac26f] hover:bg-[#fed496] px-6 py-2 rounded-full text-white text-end'>Trở về</button></span></Link>
            <h3 className='text-5xl font-bold my-[40px]'>Sign In</h3>
            <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div className='pt-[30px]'>
                  <label htmlFor="password" className='mt-[30px]' >Email</label>
                  <input {...register('email', { required: true, minLength: { value: 1, message: "Không được để trống" } })} id="email" name="email" type="text" autoComplete="current-password" required className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password" />
                  {Object.keys(errors).length !== 0 && (
                    <ul>
                      {errors.email?.type == 'required' && (<li className='text-[red] '>Không được để trống</li>)}
                      {errors.email?.message && <p className='text-[red] '>Không được để trống</p>}
                    </ul>
                  )}
                </div>
                <div className='pt-[30px]'>
                  <label htmlFor="password" className='mt-[30px]' >Password</label>
                  <input {...register('password', { required: true, minLength: { value: 1, message: "Không được để trống" } })} id="password" name="password" type="password" autoComplete="current-password" required className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password" />
                  {Object.keys(errors).length !== 0 && (
                    <ul>
                      {errors.password?.type == 'required' && (<li className='text-[red] '>Không được để trống</li>)}
                      {errors.password?.message && <p className='text-[red] '>Không được để trống</p>}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-orange-500 text-[#FFA500] focus:bg-[#FFA500]" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#FFA500]">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="/signup" className="font-medium text-[#BDBDBD] hover:text-indigo-500">No account?  <span className='text-[#28CDBA]'>Sign Up</span></a>
                </div>
              </div>
              <div>
                <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#FFA500] py-2 px-4 text-sm font-medium text-white hover:bg-[#fed496] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* Heroicon name: mini/lock-closed */}
                    <svg className="h-5 w-5  text-white group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
Signin.Layout = AuthLayout
export default Signin;