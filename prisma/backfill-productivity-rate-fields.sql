update public.tasks
set output_per_hour = round((standard_output / nullif(skilled_workers * 8, 0))::numeric, 4)
where output_per_hour = 0
  and standard_output > 0;

