require "jsduck/tag/boolean_tag"

class Anonymous < JsDuck::Tag::BooleanTag
  def initialize
    @pattern = "anonymous"
    @signature = {:long => "anonymous", :short => "anon"}
    @html_position = POS_DOC + 0.1
    super
  end

  def to_html(context)
    "<p>This is an anonymous service that can be called without authentication.</p>"
  end
end