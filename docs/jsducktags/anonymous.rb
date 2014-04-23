require "jsduck/tag/boolean_tag"

class Anonymous < JsDuck::Tag::BooleanTag
  def initialize
    @pattern = "anonymous"
    @signature = {:long => "Anonymous", :short => "anon"}
    @html_position = POS_DOC + 0.1
    @css = <<-EOCSS
      .signature .anonymous {
        color: orange;
        background: transparent;
        border: 1px solid orange;
      }
      .inner-box {
        border-color: orange;
      }
    EOCSS
    super
  end

  def to_html(context)
    <<-EOHTML
      <div class='rounded-box inner-box'>
      <p>This is an anonymous service that can be called without authentication.</p>
      </div>
    EOHTML
  end
end