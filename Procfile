web: bundle exec rails server -p $PORT
worker: bundle exec rake environment resque:scheduler
clock: bundle exec rake environment resque:work QUEUE=*

