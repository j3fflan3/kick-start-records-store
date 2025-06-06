import Link from "next/link";
import SignInForm from "../../_components/signin/SignInForm";
import SignUpShort from "../../_components/signup/SignUpShort";
import { serverGetCountries } from "../../_library/serverActions";

async function Page() {
  const { data: countries } = await serverGetCountries();
  if (!countries) {
    return (
      <div className="mx-auto w-full max-w-sm lg:w-96">
        Sorry! There was an error processing your request. 🤒 Please try again.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 items-start gap-x-0 sm:grid-cols-2 sm:gap-x-0">
      {" "}
      {/* gap-x-4 gap-y-6 */}
      {/* <div className="flex flex-1 flex-row py-2 lg:flex-none lg:px-6 xl:px-10"> */}
      <div className="mx-auto w-full min-h-svh pb-4 max-w-sm lg:max-w-md border dark:border-primary-700">
        <SignInForm
          titlePlacement="text-left"
          hideNewCustomer={true}
          title="Returning Customers"
          checkoutMessage="Sign in for faster checkout"
          buttonText="Sign in & Continue"
        />
      </div>
      {/* </div> */}
      <div className="mx-auto w-full max-w-sm pb-4 lg:max-w-md lg:block border min-h-svh dark:border-primary-700">
        <SignUpShort />
        <div className="mt-10 lg:px-8">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-primary-600" />
            </div>
            <div className="relative flex justify-center text-sm/6 font-medium">
              <span className="bg-gray-50 px-6 text-gray-900 dark:bg-primary-950 dark:text-primary-50">
                Or checkout as guest
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <Link
              href="/checkout/payment"
              className="rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-center text-primary-50 hover:bg-accent-600 active:bg-yellow-500 cursor-pointer"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
