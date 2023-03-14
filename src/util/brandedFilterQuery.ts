import { query, Query, where } from "@firebase/firestore";

type BrandFilterQueryOutput<T,F extends (keyof T) & string,V> = Query<Extract<T,Record<F,V>>>;

export const brandFilterQuery = <T,F extends (keyof T)& string,V extends string>(collectionRef: Query<T>,field: F,value: V): BrandFilterQueryOutput<T,F,V> => {
    return query(collectionRef, where(field, "==", value)) as  BrandFilterQueryOutput<T,F,V>;
}