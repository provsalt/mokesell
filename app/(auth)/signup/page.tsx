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

const Signup = () => {
  const [user, setUser] = useContext(UserContext);
  const { push } = useRouter();
  const handleSubmit = (values: z.infer<typeof signUpSchema>) => {
    fetch("/api/signup", {
      body: JSON.stringify(values),
      method: "POST"
    }).then(r => {
      console.log(r)
      if (r.status === 200) {
        if (setUser) {
          setUser({
            name: values.name,
            email: values.email,
            username: values.username,
            description: "",
          })
        }
        if (typeof localStorage === "undefined") return;
        // since setState is async, to prevent race condition, not using users const
        localStorage.setItem("user", JSON.stringify({
          name: values.name,
          email: values.email,
          username: values.username,
          description: ""
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
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="p-4 rounded-md">
        <p className="mb-4 text-lg">Welcome to Mokesell</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">

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
    </div>
  )
}

export default Signup;