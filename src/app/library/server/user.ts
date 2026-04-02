"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/app/library/supabase/server";
import { getURL } from "@/src/app/library/server/utilities";
import { getUSPSTracking } from "@/src/app/library/server/usps";

async function serverSignUp(prevState: unknown, formData: FormData): Promise<{ data: unknown; error: unknown }> {
  let firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const mailingList = Boolean(formData.get("mailingList"));
  const notifyList = Boolean(formData.get("notifyList"));
  const conCheck = formData.get("continueCheckout");
  const continueCheckout = Boolean(formData.get("continueCheckout"));
  const billingSameAsShipping = Boolean(formData.get("billingSameAsShipping"));
  console.log(
    `serverSignUp -> conCheck:${conCheck}, continueCheckout:${continueCheckout}`
  );
  // These are blank during signup (and signup short form) and used as defaults
  // Therefore we use the same fields for both shipping and billing initially
  const address = formData.get("address") as string;
  const addressContinued = formData.get("addressContinued") as string;
  const city = formData.get("city") as string;
  const stateProvince = formData.get("stateProvince") as string;
  const postalCode = formData.get("postalCode") as string;
  const destinationCountryCode = formData.get("destinationCountryCode") as string;
  if (!firstName) {
    // If the user signed up at the checkout page, extract the name before the
    // @ sign in their email address.  This will be replaced by their actual name
    // in /checkout/shipping page later (if they fill it out)
    const at = email.indexOf("@");
    firstName = email.substring(0, at);
  }
  console.log(
    `mailingList:${mailingList}, notifyList:${notifyList}, continueCheckout:${continueCheckout}`
  );
  const encodedEmail = encodeURIComponent(email);
  const captchaToken = formData.get("captchaToken") as string;
  console.log(captchaToken);
  const redirectURL =
    getURL() +
    `account/check-email/${encodedEmail}?action=signup&captchaToken=${captchaToken}`;

  const supabase = await createClient();
  console.log(`redirectURL: ${redirectURL}`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName,
        captchaToken,
        mailingList,
        notifyList,
        continueCheckout,
        billingSameAsShipping,
        shippingAddress: {
          address,
          addressContinued,
          city,
          stateProvince,
          postalCode,
          destinationCountryCode,
        },
        billingAddress: {
          address,
          addressContinued,
          city,
          stateProvince,
          postalCode,
          destinationCountryCode,
        },
      },
    },
  });
  if (error) {
    console.log(error);
    return { data, error };
  }
  redirect(redirectURL);
}

// Not currently used.
async function serverVerifyOtp({ type, token_hash }: { type: "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email"; token_hash: string }): Promise<{ error: unknown }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  return { error };
}

async function serverSignIn(prevState: unknown, formData: FormData): Promise<{ message: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  let message = "success";
  if (error) {
    console.log(error);
    message = "error";
  }
  return { message };
}

async function serverSignOut(scope: "local" | "global" | "others" = "local"): Promise<{ error: unknown }> {
  const supabase = await createClient();

  // scope: "local" only kills the user's current session.
  // Other sessions on other devices remain logged in.
  const { error } = await supabase.auth.signOut({ scope });
  if (error) {
    console.log(error);
  }
  revalidatePath("/");
  return { error };
}

async function serverResetPassword(prevState: unknown, formData: FormData): Promise<{ message: string }> {
  let message = "success";
  const email = formData.get("email") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.log(error);
    message =
      "There was a problem sending you a reset password email. Please try again.";
  }
  revalidatePath("/account/reset-password");
  return { message };
}

async function serverUpdatePassword(prevState: unknown, formData: FormData): Promise<{ message: string }> {
  const new_password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: new_password });
  let message = "success";
  if (error) {
    console.log(error.code, error.name, error.message);
    switch (error.code) {
      case "same_password":
        message =
          "Password has been previously used.  Please create a new password.";
        break;
      case "weak_password":
        message =
          "Password must be at least 8 characters in length and contain at least one of the following: Uppercase letter, lowercase letter, number, and special character (#?!@$%^&*-)";
        break;
      default:
        message = "error";
    }
  }
  return { message };
}

async function serverUpdateUser(prevState: unknown, formData: FormData): Promise<{ message: string } | never> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const mailingList = !!formData.get("mailingList");
  const notifyList = !!formData.get("notifyList");
  console.log(`mailingList=${mailingList}`);
  console.log(`notifyList=${notifyList}`);

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    email,
    data: {
      firstName,
      lastName,
      mailingList,
      notifyList,
    },
  });
  revalidatePath("/account/profile");
  if (error) {
    console.log(error.message);
    const message = "error";
    return { message };
  }
  const redirectTo = getURL() + "account/profile";
  redirect(redirectTo);
}

async function serverUpdateAnonUser(prevState: unknown, formData: FormData): Promise<{ message: string } | never> {
  const email = formData.get("email") as string;
  const zipCode = formData.get("zipcode") as string;
  const redirectURL = formData.get("redirect") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    email,
    data: {
      zipCode,
    },
  });
  revalidatePath("/checkout/signin");
  if (error) {
    console.log(error.message);
    const message = "error";
    return { message };
  }
  const redirectTo =
    getURL() + redirectURL + `/${email}?action=signupAnonymous&captchaToken=`;
  redirect(redirectTo);
}

async function serverGetUser() {
  const supabase = await createClient();
  return await supabase.auth.getUser();
}

async function serverDeleteUser(userId: string): Promise<{ message: string }> {
  const errorMessage =
    "There was an error deleting your account.  Please try again. If this error continues, contact support@kickstartrecords.com";
  let message = "success";
  const supabase = await createClient(true);
  const { error } = await supabase.auth.admin.deleteUser(userId, true);
  if (error) {
    console.log(error);
    message = errorMessage;
  }
  return { message };
}

async function serverResend(prevState: unknown, formData: FormData): Promise<{ message: string }> {
  const email = formData.get("email") as string;

  const supabase = await createClient();
  console.log(`serverResend email: ${email}`);
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  let message = "Confirmation email successfully sent.";
  if (error) {
    message =
      "There was an error resending your confirmation email.  Please try again.";
    console.log(error);
  }
  revalidatePath("/account/check-email");
  return { message };
}

interface OrderItem {
  title: string;
  artist: string | undefined;
  description: string;
  image: { url: string; height: number; width: number; uom: string } | null;
  catalogId: string;
  recordFormat: string;
  count: number;
  price: number;
  weight: number;
  sku: string;
  upc: string;
}

interface UserOrder {
  orderId: string;
  orderNumber: string;
  trackingNumber: string | null;
  payPalPaymentStatus: string;
  subtotal: number;
  shipping: number;
  handling: number;
  tax: number;
  created: string;
  fulfilled: string | null;
  shippingAddress: unknown;
  delivered: string | null;
  paymentSource: unknown;
  items: OrderItem[] | null;
  tracking?: unknown;
}

async function serverGetUserOrderList(): Promise<{ data: UserOrder[] | null; error: unknown }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const uid = user?.id ?? null;
  if (!uid) return { data: null, error: null };

  const { data: rawData, error } = await supabase
    .from("order")
    .select(`
      order_id,
      order_number,
      tracking_number,
      paypal_payment_status,
      subtotal,
      shipping,
      handling,
      tax,
      created,
      fulfilled,
      shipping_address,
      delivered,
      paypal_capture_response,
      order_catalog_mm(
        count,
        catalog(
          name,
          description,
          catalog_id,
          record_format,
          price,
          weight,
          sku,
          upc,
          artist(name),
          catalog_image_mm(image(uri, file_name, height, width, image_uom))
        )
      )
    `)
    .eq("user_id", uid)
    .order("created", { ascending: false });

  if (error) {
    console.log(`serverGetOrderList -> error: ${error.message}`);
  }

  const data: UserOrder[] | null = rawData?.map((order) => {
    const items: OrderItem[] | null = (order.order_catalog_mm as any)?.map((item: any) => {
      const c = item.catalog;
      const img = c.catalog_image_mm?.[0]?.image;
      return {
        title: c.name,
        artist: c.artist?.name,
        description: c.description,
        image: img
          ? { url: img.uri + img.file_name, height: img.height, width: img.width, uom: img.image_uom }
          : null,
        catalogId: c.catalog_id,
        recordFormat: c.record_format,
        count: item.count,
        price: c.price,
        weight: c.weight,
        sku: c.sku,
        upc: c.upc,
      };
    }) ?? null;
    return {
      orderId: order.order_id,
      orderNumber: order.order_number,
      trackingNumber: order.tracking_number,
      payPalPaymentStatus: order.paypal_payment_status,
      subtotal: order.subtotal,
      shipping: order.shipping,
      handling: order.handling,
      tax: order.tax,
      created: order.created,
      fulfilled: order.fulfilled,
      shippingAddress: order.shipping_address,
      delivered: order.delivered,
      paymentSource: (order as any).paypal_capture_response?.payment_source ?? null,
      items,
    };
  }) ?? null;

  if (
    data?.length &&
    data.length > 0 &&
    process.env.USPS_ENABLE_TRACKING_API === "true"
  ) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].trackingNumber !== null) {
        const { data: trackingData, error: trackingError } =
          await getUSPSTracking(data[i].trackingNumber as string);
        if (trackingError) {
          console.log(
            `serverGetUserOrderList -> trackingError: ${trackingError}`
          );
        }
        // append tracking data
        data[i]["tracking"] = trackingData;
      }
    }
  }
  return { data, error };
}

export {
  serverDeleteUser,
  serverGetUser,
  serverResend,
  serverResetPassword,
  serverSignUp,
  serverUpdatePassword,
  serverUpdateUser,
  serverGetUserOrderList,
};
