export const composeAsync = <TInitial, TNext, TFinal>(
    ...fns: [
        (arg: TNext) => Promise<TFinal> | TFinal,
        ...Array<(arg: any) => Promise<any> | any>
    ]
) => {
    return async (initialValue: TInitial): Promise<TFinal> => {
        return fns.reduceRight(
            async (promise, fn) => fn(await promise),
            Promise.resolve(initialValue as any)
        )
    }
}
