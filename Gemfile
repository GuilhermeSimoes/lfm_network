source 'http://rubygems.org'

gem 'rake', '10.0.3'
gem 'rails', '3.2.12'
gem 'json', '1.7.7'
gem 'nokogiri'
gem 'jquery-rails'

group :production do
  gem 'pg'
  gem 'thin'
  gem 'newrelic_rpm'
end

group :development, :test do
  gem 'sqlite3'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails', '3.2.5'
  gem 'uglifier'
end

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test do
  # Pretty printed test output
  gem 'turn', '0.8.2', :require => false
end
