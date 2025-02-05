"use client";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {loginSchema} from "@/lib/schemas";
import {useContext} from "react";
import {UserContext} from "@/providers/UserProvider";
import {useRouter} from "next/navigation";
import {DotLottieReact} from '@lottiefiles/dotlottie-react';

const loopAnimation = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/ea15dee3-8f70-44b2-a9d9-2f573380cd57/YgOC2p0OUd.lottie"
      loop
      autoplay
    />
  );
};

const Login = () => {
  const [, setUser] = useContext(UserContext);
  const {push} = useRouter();
  const handleSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log("Clicked")
    fetch("/api/login", {
      body: JSON.stringify(values),
      method: "POST"
    }).then(r => {
      if (r.status !== 200) {
        return
      }
      return r.json()
    }).then(db => {
      if (setUser) {
        setUser({
          name: db.data.name,
          email: values.email,
          username: db.data.username,
          description: db.data.description,
        })
      }
      if (typeof localStorage === "undefined") return;
      // since setState is async, to prevent race condition, not using users const
      localStorage.setItem("user", JSON.stringify({
        name: db.data.name,
        email: values.email,
        username: db.data.username,
        description: db.data.description,
      }))
      push("/")
    })
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="shadow-sm rounded-lg outline-1 bg-white outline-black/5 p-8 flex flex-row justify-center items-center gap-6 w-[600px]">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="p-4 rounded-md">
          <p className="mb-4 text-lg">Welcome back!</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button type="submit">Login</Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="w-xs h-xs">
          {loopAnimation()}
      </div>
    </div>
  </div>
  )
}

export default Login;