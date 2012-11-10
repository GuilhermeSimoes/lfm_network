class FetchController < ApplicationController
  def index
  end

  def user
    respond_to do |format|
      format.html {
        @username = params[:user]
        render :index
      }
      format.xml {
        username = params[:user].gsub(' ','+')

        get_info_url = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=#{username}&api_key=#{API_KEY}"
        get_friends_url = "http://ws.audioscrobbler.com/2.0/?method=user.getfriends&user=#{username}&api_key=#{API_KEY}&limit=20"

        begin
          info_xml = Nokogiri::XML(open(get_info_url))
          friends_xml = Nokogiri::XML(open(get_friends_url))

          builder = Nokogiri::XML::Builder.new do |xml|
            xml.lfm {
              xml.user {
                user = info_xml.at_xpath('//user')
                xml << user.at_xpath('name').to_xml
                xml << user.at_xpath('realname').to_xml
                xml << user.at_xpath('url').to_xml
                xml << user.at_xpath('playcount').to_xml
                xml << user.xpath('image').to_xml

                xml.score "1"
              }

              xml.friends {
                friends_xml.xpath('lfm/friends/user').each do |user|
                  xml.user {
                    xml << user.at_xpath('name').to_xml
                    xml << user.at_xpath('realname').to_xml
                    xml << user.at_xpath('url').to_xml
                    xml << user.at_xpath('playcount').to_xml
                    xml << user.xpath('image').to_xml

                    tasteometer_url = "http://ws.audioscrobbler.com/2.0/?method=tasteometer.compare&type1=user&type2=user&value1=#{username}&value2=#{user.at_xpath('name').text}&api_key=#{API_KEY}"
                    taste_xml = Nokogiri::XML(open(tasteometer_url))
                    xml << taste_xml.at_xpath('//score').to_xml
                  }
                end
              }
            }
          end
        rescue Exception => e
          # puts e.message
          # puts e.backtrace.join("\n")
          if e.message == '400 Bad Request'
            render xml: { error: 'User not found.' }, status: 400
          else
            render xml: { error: 'Connection to Last.fm failed.' }, status: 500
          end
        else
          render xml: builder.to_xml
        end
      }
    end
  end
end
