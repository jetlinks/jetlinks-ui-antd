import React, { useState } from "react";
import Taro from '@tarojs/taro';
import { View, Button, Form, Input, Switch } from "@tarojs/components";
import './index.less'

const Login: React.FC = () => {

    const handleSubmit = (e:any) => {
        console.log(e.detail.value)
    }

    return (
        <View className='item'>
            <View className='item-title'>Jetlinks</View>
            <View className='item-login'>
                <Form
                    onSubmit={(e:any) => {
                        handleSubmit(e)
                    //    console.log(e.detail.value)
                    }}
                >
                    <View className='item-input'>
                        <Input 
                            name='name' 
                            type='text'
                            placeholder='UserName'
                            placeholderStyle={'color: #9da1b5'} 
                            className='input'/>
                        <Input 
                            name='password' 
                            type='number' 
                            password 
                            placeholder='PassWord'
                            placeholderStyle={'color: #9da1b5'}
                            className='input'/>
                    </View>
                    <Button
                        form-type="submit"
                        // size='mini'
                        className='btn'
                        onClick={()=>{
                            Taro.switchTab({
                                url:'/pages/index/index'
                            })
                        }}
                    >
                        登 录
                    </Button>
                </Form >

            </View>
        </View>
    )
}
export default Login;