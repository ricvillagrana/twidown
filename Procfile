web: bundle exec rails server -p $PORT
worker: bundle exec rake environment resque:scheduler
worker: QUEUE=* bundle exec rake environment resque:work

