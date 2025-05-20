
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/**
 * Renders contact details content
 */
export const ContactDetails: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;
  
  const isSkillContact = Boolean(item.skill_name || item.skill_id);
  const isProvider = Boolean(item.contact_name);
  
  // Determine the item title and description
  const itemTitle = isSkillContact ? item.skill_name : item.title;
  const itemDescription = isSkillContact ? item.skill_description : item.material_description;
  const itemPrice = isSkillContact ? item.pricing : item.price;
  
  // Determine who to show as the other party
  const otherPartyName = isProvider ? item.contact_name : (isSkillContact ? item.provider_name : item.seller_name);
  const otherPartyEmail = isProvider ? item.contact_email : (isSkillContact ? item.provider_email : item.seller_email);
  const otherPartyAvatar = isProvider ? item.contact_avatar : (isSkillContact ? item.provider_avatar : item.seller_avatar);
  
  return (
    <div className="space-y-6">
      {/* Item details section */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="font-semibold text-lg mb-2">
          {isSkillContact ? "Skill" : "Material"}: {itemTitle}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="font-medium text-sm text-gray-500">Price</p>
            <p className="text-emerald-600">{itemPrice}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Status</p>
            <Badge className={
              item.status === 'Agreement Reached' ? 'bg-green-100 text-green-800' :
              item.status === 'Declined' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }>
              {item.status}
            </Badge>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Date</p>
            <p>{new Date(item.created_at).toLocaleDateString()}</p>
          </div>
          {item.conditions && (
            <div>
              <p className="font-medium text-sm text-gray-500">Conditions</p>
              <p>{item.conditions}</p>
            </div>
          )}
        </div>
        {itemDescription && (
          <div>
            <p className="font-medium text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-700">{itemDescription}</p>
          </div>
        )}
      </div>

      {/* Contact person section */}
      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-lg mb-3">
          {isProvider ? "Contact From" : "Contact To"}
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={otherPartyAvatar} />
            <AvatarFallback>{otherPartyName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{otherPartyName}</p>
            <p className="text-sm text-gray-500">{otherPartyEmail}</p>
          </div>
        </div>
      </div>

      {/* Message section */}
      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-lg mb-2">Message</h3>
        <p className="whitespace-pre-line text-gray-700 bg-gray-50 p-3 rounded">
          {item.message}
        </p>
      </div>
    </div>
  );
};
