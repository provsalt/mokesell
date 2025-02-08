"use client";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signUpSchema} from "@/lib/schemas";
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


const Signup = () => {
  const [, setUser] = useContext(UserContext);
  const {push} = useRouter();
  const handleSubmit = (values: z.infer<typeof signUpSchema>) => {
    fetch("/api/signup", {
      body: JSON.stringify(values),
      method: "POST"
    }).then(async r => {
      const exp = (await r.json()).data.exp
      if (r.status === 200) {
        if (setUser) {
          setUser({
            name: values.name,
            email: values.email,
            username: values.username,
            description: "",
            exp: exp
          })
        }
        if (typeof localStorage === "undefined") return;
        // since setState is async, to prevent race condition, not using users const
        localStorage.setItem("user", JSON.stringify({
          name: values.name,
          email: values.email,
          username: values.username,
          description: "",
          exp: exp
        }))
        push("/")
      }
    })
  }

const form = useForm<z.infer<typeof signUpSchema>>({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    username: "",
    name: "",
    email: "",
    password: "",
  },
})

return (
  <div className="flex flex-1 justify-center items-center">
    <div className="shadow-sm rounded-lg bg-white outline-1 outline-black/5 p-8 flex flex-col-reverse md:flex-row justify-center items-center gap-6 w-[600px]">
      <div className="flex-1 flex flex-col justify-center items-center w-full">
      <p className="flex flex-row mb-4 text-xl font-medium">Welcome to Mokesell</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">

              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

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
              <Button type="submit">Sign up</Button>
            </form>
          </Form>
        </div>
        <div className="w-xs h-xs">
          {loopAnimation()}
        </div>
    </div>
  </div>
  )
}

export default Signup;