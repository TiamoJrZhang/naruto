import React from 'react';
import { useForm } from 'react-hook-form';
import { produce } from './resource/proxycopy' 

function Child() {
  const { register, handleSubmit, errors } = useForm(); // initialise the hook
  // const onSubmit = data => {
  //   console.log(data);
  // };
  const state = {
    info: {
      name: 'jack',
      career: {
        first: {
          name: '111'
        }
      }
    },
    data: [1]
  }
  
  const data = produce(state, draftState => {
    draftState.info.career.first.name = '222'
  })
  console.log('data', data.data === state.data)

  return (
    // <form>
    //   <input name="firstname" ref={register} /> {/* register an input */}
    //   <input name="lastname" ref={register({ required: true })} />
    //   {errors && 'Last name is required.'}
    //   <input name="age" ref={register({ pattern: /\d+/ })} />
    //   {errors && 'Please enter number for age.'}
    //   <input type="submit" />
    // </form>
    <>
      child
    </>
  );
}

export default Child