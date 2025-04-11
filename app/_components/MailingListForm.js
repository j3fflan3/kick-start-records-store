function MailingListForm() {
  return (
    <div className="w-full content-center">
      <form>
        <div className="grid-flow-row w-full box-border">
          <div className="flex w-full content-center pt-3 pb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full text-lg rounded-md p-3 text-primary-900"
              autoFocus
            />
          </div>
          <div className="flex w-full content-center pb-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full text-lg rounded-md p-3 text-primary-900"
            />
          </div>
          <div className="flex w-full content-center">
            <button className="bg-accent-700 px-3 py-2 w-full text-2xl border-primary-500 rounded-md font-bold">
              Sign me up!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MailingListForm;
