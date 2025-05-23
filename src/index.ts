import { Effect } from "effect";

const addServiceCharge = (amount: number) => amount + 1;

const applyDiscount = (
  total: number,
  discountRate: number,
): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error("Discount rate cannot be zero"))
    : Effect.succeed(total - (total * discountRate) / 100);

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100));
const fetchDiscountRate = Effect.promise(() => Promise.resolve(5));

const program = Effect.gen(function* () {
  const transactionAmount = yield* fetchTransactionAmount;
  const discountRate = yield* fetchDiscountRate;
  const discountedAmount = yield* applyDiscount(
    transactionAmount,
    discountRate,
  );

  const finalAmount = addServiceCharge(discountedAmount);
  return `Final amount to charge: ${finalAmount}`;
});

Effect.runPromise(program).then(console.log);
