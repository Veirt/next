interface IProps {
  message: string;
}

const MatchNotice = (props: IProps) => {
  const { message } = props;
  return (
    <div className="match--container py-8">
      <div className="text-lg text-white font-semibold text-center py-16">{message}</div>
    </div>
  );
};

export default MatchNotice;
