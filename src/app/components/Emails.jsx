'use client';

import { useActionState } from 'react';
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '../api/form/action';

const initialState = {
  success: false,
  message: '',
};

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    initialState
  );

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-black text-black">
        Subscribe To Our Newsletter
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Get the latest updates delivered straight to your inbox.
      </p>

      {state.success ? (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {state.message}
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="text-sm font-black text-black block"
            >
              First Name (Optional)
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Alex"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-black text-black"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="alex@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          {state.message && !state.success && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-bold  hover:bg-[#f39f04] transition disabled:opacity-50"
          >
            {isPending ? 'Subscribing...' : 'Subscribe'}
          </button>

		
        </form>
      )}
    </div>
  );
}


export function UnsubscribeNewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    unsubscribeFromNewsletter,
    initialState
  );

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-black text-black">
        Unsubscribe From Our Newsletter
      </h3>
<br>
</br>
      {state.success ? (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {state.message}
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-black text-black"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="alex@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          {state.message && !state.success && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}
		   
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-bold  hover:bg-[#fe0101] transition disabled:opacity-50"
          >
            {isPending ? 'UnSubscribing...' : 'UnSubscribe'}
          </button>
        </form>
      )}
    </div>
  );
}