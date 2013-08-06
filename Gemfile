source 'https://rubygems.org'

ruby '1.9.3'

gem 'rake', '~> 10.1.0'
gem 'rails', '~> 3.2.14'
gem 'json', '~> 1.8.0'
gem 'nokogiri', '~> 1.6.0'
gem 'jquery-rails', '~> 2.3.0'

group :production do
  gem 'pg', '~> 0.16.0'
  gem 'thin', '~> 1.5.1'
end

group :development, :test do
  gem 'sqlite3', '~> 1.3.7'
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
