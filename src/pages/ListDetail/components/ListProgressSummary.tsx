import { ProgressBar, ProgressFill, ProgressMeta, ProgressText } from "../styles";

type Props = {
  total: number;
  completed: number;
  pending: number;
  progress: number;
};

export function ListProgressSummary({
  total,
  completed,
  pending,
  progress,
}: Props) {
  return (
    <>
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>

      <ProgressMeta>
        <ProgressText>
          {total} itens • {completed} feitos • {pending} pendentes
        </ProgressText>
      </ProgressMeta>
    </>
  );
}
