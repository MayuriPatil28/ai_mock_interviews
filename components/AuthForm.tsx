"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FormField from "./FormField";

import { signIn, signUp } from "@/lib/actions/auth.action";

type FormType = "sign-in" | "sign-up";

// Form validation schema
const authFormSchema = (type: FormType) =>
    z.object({
        name: type === "sign-up" ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { name, email, password } = values;

        try {
            if (type === "sign-up") {
                // Create Firebase Auth user
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                // Save user to Firestore via server action
                const result = await signUp({
                    uid:userCredentials.user.uid,
                    name:name!,
                    email,
                    password,
                })

                if (!result?.success) {
                    toast.error(result.message || "Account creation failed.");
                    return;
                }

                toast.success("Account created successfully. Please sign in.");
                router.push("/sign-in");
            } else {
                // Sign in with Firebase
                const {email,password} = values;
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error('Sign in failed');
                    return;
                }
                await signIn({
                    email,idToken
                })
                // Set session cookie server-side
                // const result = await signIn({ email, idToken });
                //
                // if (!result?.success) {
                //     toast.error(result?.message || "Sign-in failed.");
                //     return;
                // }

                toast.success("Signed in successfully.");
                router.push("/");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Authentication failed.");
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="card-border lg:min-w-[566px]">
                <div className="flex flex-col gap-6 card py-14 px-10">
                    <div className="flex flex-row gap-2 justify-center">
                        <Image src="/logo.svg" alt="logo" height={32} width={32} />
                        <h2 className="text-primary-100">PrepWise</h2>
                    </div>
                    <h3>Practice job interviews with AI</h3>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                            {!isSignIn && (
                                <FormField
                                    control={form.control}
                                    name="name"
                                    label="Name"
                                    placeholder="Your name"
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Your email address"
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                label="Password"
                                placeholder="Enter password"
                                type="password"
                            />
                            <Button className="btn" type="submit">
                                {isSignIn ? "Sign in" : "Create an Account"}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center">
                        {isSignIn ? "No account yet?" : "Have an account already?"}
                        <Link
                            href={!isSignIn ? "/sign-in" : "/sign-up"}
                            className="font-bold text-user-primary ml-1"
                        >
                            {!isSignIn ? "Sign in" : "Sign up"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
