source 'http://rubygems.org'

gem 'rake', '0.8.7'
gem 'rails', '3.1.4'
gem 'nokogiri'
gem 'jquery-rails'

#PostgreSQL
group :production do
  gem 'pg'
  gem 'thin'
  gem 'newrelic_rpm'
end
#SQLite
group :development, :test do
  gem 'sqlite3'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails', '3.1.4'
  gem 'coffee-rails', '~> 3.1.0'
  gem 'uglifier'
end

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test do
  # Pretty printed test output
  gem 'turn', '0.8.2', :require => false
end
