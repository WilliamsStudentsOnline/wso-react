// TODO(ts): utilState has no reducer registered in the store; shape is a loose placeholder.
interface UtilStateSlice {
  utilState: { getWarning: unknown; getNotice: unknown };
}

const getWarning = ({ utilState }: UtilStateSlice) => utilState.getWarning;
const getNotice = ({ utilState }: UtilStateSlice) => utilState.getNotice;
export { getWarning, getNotice };
