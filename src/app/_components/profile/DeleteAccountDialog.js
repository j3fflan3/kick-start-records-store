"use client";
import { useState } from "react";
import { Button } from "../tailwind/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../tailwind/dialog";
import { Field, Label } from "../tailwind/fieldset";
import { Input } from "../tailwind/input";
import { serverDeleteUser } from "../../_library/serverActions";
import { useRouter } from "next/navigation";
import { clientSignOut } from "../../_library/clientActions";

function DeleteAccountDialog({ userId }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMyAccount, setDeleteMyAccount] = useState("");
  const [errorMessage, setErrorMesage] = useState("");
  const deleteDisabled = deleteMyAccount !== "delete my account";
  function handleConfirmOnChange(e) {
    setDeleteMyAccount(e.target.value);
  }
  async function handleDeleteAccount() {
    setErrorMesage("");
    // sign the user out
    await clientSignOut("global");
    // delete the user
    const { message } = await serverDeleteUser(userId);

    if (message === "success") {
      router.push("/account/deleted/success");
      setDeleteMyAccount("");
      setIsOpen(false);
      return;
    } else {
      setErrorMesage(message);
    }
  }
  function handleCancel() {
    setIsOpen(false);
    setDeleteMyAccount("");
    setErrorMesage("");
  }

  const buttonClass =
    "ml-3 border border-primary-700 rounded-md text-base py-1 px-6 hover:cursor-pointer inline-block hover:bg-accent-600 transition-all hover:text-primary-50";
  const disabledButtonClass =
    "ml-3 border border-primary-700 rounded-md text-base py-1 px-6 hover:cursor-not-allowed inline-block transition-all";
  const enabledDeleteCalss =
    "ml-3 border border-primary-700 rounded-md text-base py-1 px-6 bg-accent-600 text-primary-100 hover:cursor-pointer inline-block hover:bg-accent-700 transition-all hover:text-primary-50";
  return (
    <>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setIsOpen(true)}
      >
        Delete Account
      </button>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="border-4 border-yellow-500 dark:border-accent-700"
      >
        <DialogTitle className="!text-accent-700 !text-2xl dark:!text-yellow-600">
          Delete Account
        </DialogTitle>
        <DialogDescription className="!text-black dark:!text-primary-50">
          Confirm you want to delete your account.{" "}
          <span className="text-accent-600 dark:text-accent-500 font-bold">
            This is permanent and non-recoverable.
          </span>
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>
              Are you sure you want to delete your account? Enter{" "}
              <strong>delete my account</strong> in the field below.
            </Label>
            <Input
              name="confirm"
              placeholder="delete my account"
              type="text"
              value={deleteMyAccount}
              onChange={handleConfirmOnChange}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <button className={buttonClass} onClick={handleCancel}>
            Cancel
          </button>
          <button
            disabled={deleteDisabled}
            className={`${
              deleteDisabled ? disabledButtonClass : enabledDeleteCalss
            }`}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </DialogActions>
        <DialogDescription className="mt-5 text-accent-600 text-center">
          {errorMessage}
        </DialogDescription>
      </Dialog>
    </>
  );
}

export default DeleteAccountDialog;
