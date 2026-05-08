update public.tasks
set
  time_hours = coalesce(nullif(time_hours, 0), 8),
  supervisor_workers = 0,
  foreman_workers = 0,
  carpenter_workers = case when worker_trade = 'Carpenter' then skilled_workers else 0 end,
  mason_workers = case when worker_trade = 'Mason' then skilled_workers else 0 end,
  steelman_workers = case when worker_trade = 'Steelman' then skilled_workers else 0 end,
  welder_workers = case when worker_trade = 'Welder' then skilled_workers else 0 end,
  painter_workers = case when worker_trade = 'Painter' then skilled_workers else 0 end,
  operator_workers = case when worker_trade = 'Operator' then skilled_workers else 0 end
where
  supervisor_workers = 0
  and foreman_workers = 0
  and carpenter_workers = 0
  and steelman_workers = 0
  and welder_workers = 0
  and painter_workers = 0
  and operator_workers = 0;

